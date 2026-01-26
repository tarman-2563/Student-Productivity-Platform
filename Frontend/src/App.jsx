import { useState, useEffect } from 'react';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Dashboard from './components/Dashboard';
import DailyPlanner from './modules/studyPlanner/pages/DailyPlanner';
import Goals from './modules/goals/pages/Goals';
import AnalyticsDashboard from './modules/analytics/pages/AnalyticsDashboard';
import NotesPage from './modules/notes/pages/NotesPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState('login');
  const [activeModule, setActiveModule] = useState('dashboard');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      setCurrentView('app');
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentView('app');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setCurrentView('login');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-soft">
          <div>
            <h1 className="text-xl font-bold text-gradient">StudySphere</h1>
            <p className="text-sm text-gray-600">Your personal study companion</p>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => setCurrentView('login')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                currentView === 'login' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-white/50 text-gray-700 hover:bg-white/80 border border-gray-200'
              }`}
            >
              Login
            </button>
            <button 
              onClick={() => setCurrentView('register')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                currentView === 'register' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-white/50 text-gray-700 hover:bg-white/80 border border-gray-200'
              }`}
            >
              Register
            </button>
          </div>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            {currentView === 'login' && <Login onLogin={handleLogin} />}
            {currentView === 'register' && <Register onRegister={() => setCurrentView('login')} />}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <div className="w-60 bg-white border-r border-gray-200 flex flex-col flex-shrink-0 shadow-soft">
        <div className="p-4 border-b border-gray-100">
          <h1 className="text-lg font-semibold text-gray-900 tracking-tight">StudySphere</h1>
        </div>
        
        <nav className="flex-1 p-2 scrollbar-thin">
          <div className="mb-6">
            <button 
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 mb-2 ${
                activeModule === 'dashboard' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
              onClick={() => setActiveModule('dashboard')}
            >
              <span className="w-5 h-5 flex items-center justify-center">🏠</span>
              <span>Dashboard</span>
            </button>
          </div>
          
          <div className="mb-6">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">Study</div>
            <div className="space-y-1">
              <button 
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeModule === 'planner' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={() => setActiveModule('planner')}
              >
                <span className="w-5 h-5 flex items-center justify-center">📅</span>
                <span>Daily Planner</span>
              </button>
              <button 
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeModule === 'goals' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={() => setActiveModule('goals')}
              >
                <span className="w-5 h-5 flex items-center justify-center">🎯</span>
                <span>Goals</span>
              </button>
              <button 
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeModule === 'analytics' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={() => setActiveModule('analytics')}
              >
                <span className="w-5 h-5 flex items-center justify-center">📊</span>
                <span>Analytics</span>
              </button>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">Tools</div>
            <button 
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeModule === 'notes' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
              onClick={() => setActiveModule('notes')}
            >
              <span className="w-5 h-5 flex items-center justify-center">📝</span>
              <span>Notes</span>
            </button>
          </div>
        </nav>
        
        <div className="p-2 border-t border-gray-100">
          <button 
            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
            onClick={handleLogout}
          >
            <span className="w-5 h-5 flex items-center justify-center">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0 shadow-soft">
          <h2 className="text-lg font-semibold text-gray-900">
            {activeModule === 'dashboard' && 'Dashboard'}
            {activeModule === 'planner' && 'Daily Planner'}
            {activeModule === 'goals' && 'Goals'}
            {activeModule === 'analytics' && 'Analytics'}
            {activeModule === 'notes' && 'Notes'}
          </h2>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">Welcome back!</div>
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
              U
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto bg-gray-50 scrollbar-thin">
          {activeModule === 'dashboard' && <Dashboard onNavigate={setActiveModule} />}
          {activeModule === 'planner' && <DailyPlanner />}
          {activeModule === 'goals' && <Goals />}
          {activeModule === 'analytics' && <AnalyticsDashboard />}
          {activeModule === 'notes' && <NotesPage />}
        </div>
      </div>
    </div>
  );
}

export default App;