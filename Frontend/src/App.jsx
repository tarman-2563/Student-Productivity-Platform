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
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
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
              {currentView === 'login' && <Login onLogin={handleLogin} onSwitchToRegister={() => setCurrentView('register')} />}
              {currentView === 'register' && <Register onRegister={() => setCurrentView('login')} onSwitchToLogin={() => setCurrentView('login')} />}
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
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
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
              <svg className={`w-5 h-5 ${activeModule === 'dashboard' ? 'text-white' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
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
                <svg className={`w-5 h-5 ${activeModule === 'planner' ? 'text-white' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
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
                <svg className={`w-5 h-5 ${activeModule === 'goals' ? 'text-white' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
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
                <svg className={`w-5 h-5 ${activeModule === 'analytics' ? 'text-white' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
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
                <svg className={`w-5 h-5 ${activeModule === 'notes' ? 'text-white' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
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
                <svg className={`w-5 h-5 ${activeModule === 'resources' ? 'text-white' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
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
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="h-16 glass border-b border-gray-200/40 flex items-center justify-between px-8 flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {activeModule === 'dashboard' && 'Dashboard'}
              {activeModule === 'planner' && 'Daily Planner'}
              {activeModule === 'goals' && 'Goals'}
              {activeModule === 'analytics' && 'Analytics'}
              {activeModule === 'notes' && 'Notes'}
              {activeModule === 'resources' && 'Resources'}
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
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-700 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
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