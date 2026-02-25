import { useState, useEffect } from 'react';
import axios from '../api/axios';

const Dashboard = ({ onNavigate }) => {
  const [stats, setStats] = useState({
    todayTasks: 0,
    completedTasks: 0,
    activeGoals: 0,
    totalNotes: 0,
    studyStreak: 0,
    todayStudyTime: 0
  });

  const [todayTasks, setTodayTasks] = useState([]);
  const [activeGoals, setActiveGoals] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const today = new Date().toISOString().split('T')[0];
      
      const [tasksResponse, goalsResponse, notesResponse, analyticsResponse] = await Promise.allSettled([
        axios.get(`/study-tasks?date=${today}`),
        axios.get('/goals'),
        axios.get('/notes'),
        axios.get('/analytics?timeRange=week')
      ]);

      let dashboardStats = {
        todayTasks: 0,
        completedTasks: 0,
        activeGoals: 0,
        totalNotes: 0,
        studyStreak: 0,
        todayStudyTime: 0
      };

      let tasks = [];
      let goals = [];

      if (tasksResponse.status === 'fulfilled') {
        const taskData = tasksResponse.value.data;
        tasks = Array.isArray(taskData) ? taskData : taskData.tasks || [];
        dashboardStats.todayTasks = tasks.length;
        dashboardStats.completedTasks = tasks.filter(task => task.status === 'Completed').length;
      }

      if (goalsResponse.status === 'fulfilled') {
        const goalData = goalsResponse.value.data;
        goals = Array.isArray(goalData) ? goalData : goalData.goals || [];
        dashboardStats.activeGoals = goals.filter(goal => goal.status === 'active').length;
      }

      if (notesResponse.status === 'fulfilled') {
        const noteData = notesResponse.value.data;
        const notes = Array.isArray(noteData) ? noteData : noteData.notes || [];
        dashboardStats.totalNotes = notes.length;
      }

      if (analyticsResponse.status === 'fulfilled') {
        const analyticsData = analyticsResponse.value.data;
        if (analyticsData.overview) {
          dashboardStats.studyStreak = analyticsData.overview.studyStreak || 0;
          dashboardStats.todayStudyTime = analyticsData.overview.totalStudyTime || 0;
        }
      }

      setStats(dashboardStats);
      setTodayTasks(tasks.slice(0, 4));
      setActiveGoals(goals.filter(goal => goal.status === 'active').slice(0, 4));
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      
      setStats({
        todayTasks: 0,
        completedTasks: 0,
        activeGoals: 0,
        totalNotes: 0,
        studyStreak: 0,
        todayStudyTime: 0
      });
      setTodayTasks([]);
      setActiveGoals([]);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getTrendText = (current, type) => {
    if (current === 0) return 'Get started!';
    
    switch (type) {
      case 'tasks':
        const completionRate = (stats.completedTasks / stats.todayTasks) * 100;
        if (completionRate >= 80) return 'Excellent progress!';
        if (completionRate >= 50) return 'Good momentum!';
        return 'Keep going!';
      case 'goals':
        if (current >= 5) return 'Very ambitious!';
        if (current >= 3) return 'Great focus!';
        return 'Good start!';
      case 'streak':
        if (current >= 7) return 'Amazing streak!';
        if (current >= 3) return 'Building habit!';
        return 'Keep it up!';
      case 'time':
        if (current >= 180) return 'Highly productive!';
        if (current >= 120) return 'Good focus time!';
        return 'Building momentum!';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="h-32 bg-gray-200 rounded-lg mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 h-64 bg-gray-200 rounded-lg"></div>
              <div className="h-64 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const quickActions = [
    { title: 'Add Task', icon: '➕', action: () => onNavigate('planner'), color: 'bg-blue-600 hover:bg-blue-700' },
    { title: 'Create Goal', icon: '🎯', action: () => onNavigate('goals'), color: 'bg-blue-600 hover:bg-blue-700' },
    { title: 'New Note', icon: '📝', action: () => onNavigate('notes'), color: 'bg-blue-600 hover:bg-blue-700' },
    { title: 'View Analytics', icon: '📊', action: () => onNavigate('analytics'), color: 'bg-blue-600 hover:bg-blue-700' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 animate-fadeInUp">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {getGreeting()}! 👋
              </h1>
              <p className="text-gray-600">{formatDate(currentTime)}</p>
              <p className="text-gray-500 text-sm mt-1">Ready to make today productive?</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-mono text-gray-900 bg-white px-4 py-2 rounded-xl shadow-soft">
                {currentTime.toLocaleTimeString('en-US', { 
                  hour12: false,
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
              <div className="text-sm text-gray-500 mt-1">Current Time</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Today's Tasks"
            value={stats.todayTasks === 0 ? '0' : `${stats.completedTasks}/${stats.todayTasks}`}
            subtitle="completed"
            icon="📋"
            color="bg-blue-50 text-blue-600"
            progress={stats.todayTasks === 0 ? 0 : (stats.completedTasks / stats.todayTasks) * 100}
            trend={getTrendText(stats.completedTasks, 'tasks')}
          />
          <StatCard
            title="Active Goals"
            value={stats.activeGoals}
            subtitle="in progress"
            icon="🎯"
            color="bg-green-50 text-green-600"
            trend={getTrendText(stats.activeGoals, 'goals')}
          />
          <StatCard
            title="Study Streak"
            value={`${stats.studyStreak} days`}
            subtitle="keep it up!"
            icon="🔥"
            color="bg-orange-50 text-orange-600"
            trend={getTrendText(stats.studyStreak, 'streak')}
          />
          <StatCard
            title="Study Time Today"
            value={`${Math.floor(stats.todayStudyTime / 60)}h ${stats.todayStudyTime % 60}m`}
            subtitle="focused time"
            icon="⏱️"
            color="bg-purple-50 text-purple-600"
            trend={getTrendText(stats.todayStudyTime, 'time')}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-soft p-6 animate-fadeInUp">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className={`${action.color} text-white p-4 rounded-xl hover:opacity-90 hover:scale-105 transition-all duration-200 flex flex-col items-center space-y-2 shadow-soft hover:shadow-medium`}
                  >
                    <span className="text-2xl">{action.icon}</span>
                    <span className="text-sm font-medium">{action.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-soft p-6 animate-fadeInUp">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Today's Schedule</h3>
              <button 
                onClick={() => onNavigate('planner')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline transition-colors"
              >
                View All
              </button>
            </div>
            <div className="space-y-3">
              {todayTasks.length > 0 ? (
                todayTasks.map((task, index) => (
                  <ScheduleItem 
                    key={task._id || index}
                    title={task.title}
                    duration={`${task.duration || 60}m`}
                    status={task.status}
                  />
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2 opacity-50">📅</div>
                  <p className="text-gray-500 text-sm">No tasks scheduled for today</p>
                  <button 
                    onClick={() => onNavigate('planner')}
                    className="text-blue-600 hover:text-blue-700 text-xs mt-2 hover:underline transition-colors"
                  >
                    Add your first task
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-soft p-6 animate-fadeInUp">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Goal Progress</h3>
              <button 
                onClick={() => onNavigate('goals')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline transition-colors"
              >
                View All
              </button>
            </div>
            <div className="space-y-4">
              {activeGoals.length > 0 ? (
                activeGoals.map((goal, index) => (
                  <GoalProgress 
                    key={goal._id || index}
                    title={goal.title} 
                    progress={goal.progress || 0} 
                  />
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2 opacity-50">🎯</div>
                  <p className="text-gray-500 text-sm">No active goals</p>
                  <button 
                    onClick={() => onNavigate('goals')}
                    className="text-blue-600 hover:text-blue-700 text-xs mt-2 hover:underline transition-colors"
                  >
                    Create your first goal
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, subtitle, icon, color, progress, trend }) => (
  <div className="bg-white rounded-xl shadow-soft p-6 hover:shadow-medium transition-all duration-300 hover:-translate-y-1 animate-fadeInUp">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        {trend && (
          <p className="text-xs text-green-600 mt-1 font-medium">{trend}</p>
        )}
        {progress !== undefined && (
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
      <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center text-xl ml-4 shadow-soft`}>
        {icon}
      </div>
    </div>
  </div>
);

const ScheduleItem = ({ title, duration, status }) => (
  <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-lg hover:from-gray-100 hover:to-blue-100/50 transition-all duration-200 cursor-pointer group">
    <div className="flex-1">
      <p className={`text-sm font-medium transition-colors ${
        status === 'Completed' ? 'text-gray-500 line-through' : 'text-gray-900 group-hover:text-blue-700'
      }`}>
        {title}
      </p>
      <p className="text-xs text-gray-500">{duration}</p>
    </div>
    <div className={`w-3 h-3 rounded-full shadow-sm ${
      status === 'Completed' ? 'bg-green-500' : 
      status === 'In Progress' ? 'bg-yellow-500 animate-pulse' : 
      'bg-blue-500'
    }`}></div>
  </div>
);

const GoalProgress = ({ title, progress }) => (
  <div className="p-3 rounded-lg hover:bg-gray-50 transition-colors">
    <div className="flex justify-between items-center mb-2">
      <span className="text-sm font-medium text-gray-900 truncate">{title}</span>
      <span className="text-sm text-gray-600 font-medium">{progress}%</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
      <div 
        className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-700 ease-out shadow-sm"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  </div>
);

export default Dashboard;