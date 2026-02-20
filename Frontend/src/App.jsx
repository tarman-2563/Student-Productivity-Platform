import { useState, useEffect } from 'react';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Dashboard from './components/Dashboard';
import DailyPlanner from './modules/studyPlanner/pages/DailyPlanner';
import Goals from './modules/goals/pages/Goals';
import AnalyticsDashboard from './modules/analytics/pages/AnalyticsDashboard';
import NotesPage from './modules/notes/pages/NotesPage';
import ResourceLibrary from './modules/resources/pages/ResourceLibrary';

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
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
        <div className="glass border-b border-gray-200/40 px-8 py-6 flex justify-between items-center shadow-soft">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gradient">StudySphere</h1>
              <p className="text-sm text-gray-600 font-medium">Your personal study companion</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={() => setCurrentView('login')}
              className={`btn-md transition-all duration-300 ${
                currentView === 'login' 
                  ? 'btn-primary shadow-primary/30' 
                  : 'btn-secondary'
              }`}
            >
              Login
            </button>
            <button 
              onClick={() => setCurrentView('register')}
              className={`btn-md transition-all duration-300 ${
                currentView === 'register' 
                  ? 'btn-primary shadow-primary/30' 
                  : 'btn-secondary'
              }`}
            >
              Register
            </button>
          </div>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="animate-fadeInUp">
              {currentView === 'login' && <Login onLogin={handleLogin} />}
              {currentView === 'register' && <Register onRegister={() => setCurrentView('login')} />}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/10">
      <div className="w-72 bg-white/95 backdrop-blur-md border-r border-gray-200/40 flex flex-col flex-shrink-0 shadow-soft">
        <div className="p-6 border-b border-gray-100/60 bg-gradient-to-r from-gray-50/50 to-white/30">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gradient">StudySphere</h1>
              <p className="text-xs text-gray-600 font-medium">Study Smarter, Not Harder</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 scrollbar-thin">
          <div className="mb-8">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-3">Overview</div>
            <button 
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeModule === 'dashboard' 
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-primary/25 hover:shadow-primary/35' 
                  : 'text-gray-700 hover:bg-gray-100/80 hover:text-gray-900'
              }`}
              onClick={() => setActiveModule('dashboard')}
            >
              <span className="w-5 h-5 flex items-center justify-center text-lg">🏠</span>
              <span>Dashboard</span>
              {activeModule === 'dashboard' && (
                <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
              )}
            </button>
          </div>
          
          <div className="mb-8">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-3">Study Tools</div>
            <div className="space-y-2">
              <button 
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeModule === 'planner' 
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-primary/25 hover:shadow-primary/35' 
                    : 'text-gray-700 hover:bg-gray-100/80 hover:text-gray-900'
                }`}
                onClick={() => setActiveModule('planner')}
              >
                <span className="w-5 h-5 flex items-center justify-center text-lg">📅</span>
                <span>Daily Planner</span>
                {activeModule === 'planner' && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </button>
              <button 
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeModule === 'goals' 
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-primary/25 hover:shadow-primary/35' 
                    : 'text-gray-700 hover:bg-gray-100/80 hover:text-gray-900'
                }`}
                onClick={() => setActiveModule('goals')}
              >
                <span className="w-5 h-5 flex items-center justify-center text-lg">🎯</span>
                <span>Goals</span>
                {activeModule === 'goals' && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </button>
              <button 
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeModule === 'analytics' 
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-primary/25 hover:shadow-primary/35' 
                    : 'text-gray-700 hover:bg-gray-100/80 hover:text-gray-900'
                }`}
                onClick={() => setActiveModule('analytics')}
              >
                <span className="w-5 h-5 flex items-center justify-center text-lg">📊</span>
                <span>Analytics</span>
                {activeModule === 'analytics' && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </button>
            </div>
          </div>
          
          <div className="mb-8">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-3">Productivity</div>
            <div className="space-y-2">
              <button 
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeModule === 'notes' 
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-primary/25 hover:shadow-primary/35' 
                    : 'text-gray-700 hover:bg-gray-100/80 hover:text-gray-900'
                }`}
                onClick={() => setActiveModule('notes')}
              >
                <span className="w-5 h-5 flex items-center justify-center text-lg">📝</span>
                <span>Notes</span>
                {activeModule === 'notes' && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </button>
              <button 
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeModule === 'resources' 
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-primary/25 hover:shadow-primary/35' 
                    : 'text-gray-700 hover:bg-gray-100/80 hover:text-gray-900'
                }`}
                onClick={() => setActiveModule('resources')}
              >
                <span className="w-5 h-5 flex items-center justify-center text-lg">📚</span>
                <span>Resources</span>
                {activeModule === 'resources' && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </button>
            </div>
          </div>
        </nav>
        
        <div className="p-4 border-t border-gray-100/60 bg-gradient-to-r from-white/50 to-gray-50/30">
          <button 
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50/80 hover:text-red-700 transition-all duration-200"
            onClick={handleLogout}
          >
            <span className="w-5 h-5 flex items-center justify-center text-lg">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="h-16 glass border-b border-gray-200/40 flex items-center justify-between px-8 flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {activeModule === 'dashboard' && '📊 Dashboard'}
              {activeModule === 'planner' && '📅 Daily Planner'}
              {activeModule === 'goals' && '🎯 Goals'}
              {activeModule === 'analytics' && '📈 Analytics'}
              {activeModule === 'notes' && '📝 Notes'}
              {activeModule === 'resources' && '📚 Resources'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {activeModule === 'dashboard' && 'Track your progress and overview'}
              {activeModule === 'planner' && 'Plan your study schedule'}
              {activeModule === 'goals' && 'Manage your learning objectives'}
              {activeModule === 'analytics' && 'Analyze your study patterns'}
              {activeModule === 'notes' && 'Organize your thoughts and ideas'}
              {activeModule === 'resources' && 'Access your study materials'}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm font-semibold text-gray-900">Welcome back!</div>
              <div className="text-xs text-gray-600">Ready to study today?</div>
            </div>
            <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-700 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-lg">
              U
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto scrollbar-thin p-6">
          <div className="animate-fadeIn">
            {activeModule === 'dashboard' && <Dashboard onNavigate={setActiveModule} />}
            {activeModule === 'planner' && <DailyPlanner />}
            {activeModule === 'goals' && <Goals />}
            {activeModule === 'analytics' && <AnalyticsDashboard />}
            {activeModule === 'notes' && <NotesPage />}
            {activeModule === 'resources' && <ResourceLibrary />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;