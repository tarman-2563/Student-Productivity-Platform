import { useState, useEffect } from 'react';
import Login from './Pages/Login';
import Register from './Pages/Register';
import DailyPlanner from './modules/studyPlanner/pages/DailyPlanner';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState('login');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      setCurrentView('planner');
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentView('planner');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setCurrentView('login');
  };

  if (!isAuthenticated) {
    return (
      <div className="app">
        <nav>
          <h1>StudySphere</h1>
          <div>
            <button 
              onClick={() => setCurrentView('login')}
              className={currentView === 'login' ? 'active' : ''}
            >
              Login
            </button>
            <button 
              onClick={() => setCurrentView('register')}
              className={currentView === 'register' ? 'active' : ''}
            >
              Register
            </button>
          </div>
        </nav>
        
        <main>
          {currentView === 'login' && <Login onLogin={handleLogin} />}
          {currentView === 'register' && <Register onRegister={() => setCurrentView('login')} />}
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <nav>
        <h1>StudySphere</h1>
        <div>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>
      
      <main>
        <DailyPlanner />
      </main>
    </div>
  );
}

export default App;