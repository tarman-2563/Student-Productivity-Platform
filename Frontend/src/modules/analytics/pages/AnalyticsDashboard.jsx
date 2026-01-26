import { useState } from 'react';
import useAnalytics from '../hooks/useAnalytics';
import YearlyHeatmap from '../components/YearlyHeatmap';

const AnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState('week');
  const { data, loading, error, refetch } = useAnalytics(timeRange);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 h-80 bg-gray-200 rounded-lg"></div>
              <div className="h-80 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="text-red-500 text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Failed to Load Analytics</h2>
            <p className="text-gray-600 mb-6">We couldn't load your analytics data. Please try again.</p>
            <button 
              onClick={refetch}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Check if we have any data
  const hasData = data && (
    data.overview.totalStudyTime > 0 || 
    data.studyTrends.length > 0 || 
    data.goalProgress.length > 0
  );

  if (!hasData && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Study Analytics</h1>
              <p className="text-gray-600">Track your study progress and habits</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-gray-400 text-8xl mb-6">📈</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Start Studying to See Your Analytics</h2>
            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
              Complete study tasks and work on your goals to see your progress, streaks, and study patterns here.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="text-blue-600 text-3xl mb-3">📚</div>
                <h3 className="font-semibold text-gray-900 mb-2">Complete Tasks</h3>
                <p className="text-sm text-gray-600">Finish study tasks to track your time</p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-6">
                <div className="text-green-600 text-3xl mb-3">🎯</div>
                <h3 className="font-semibold text-gray-900 mb-2">Work on Goals</h3>
                <p className="text-sm text-gray-600">Make progress on your learning goals</p>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-6">
                <div className="text-purple-600 text-3xl mb-3">🔥</div>
                <h3 className="font-semibold text-gray-900 mb-2">Build Streaks</h3>
                <p className="text-sm text-gray-600">Study consistently to build momentum</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Study Analytics</h1>
            <p className="text-gray-600">Track your study progress and habits</p>
          </div>
          
          {/* Time Range Selector */}
          <div className="flex bg-white rounded-lg shadow-sm p-1 mt-4 sm:mt-0">
            {[
              { value: 'week', label: 'This Week', icon: '📅' },
              { value: 'month', label: 'This Month', icon: '🗓️' }
            ].map((range) => (
              <button
                key={range.value}
                onClick={() => setTimeRange(range.value)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  timeRange === range.value
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span>{range.icon}</span>
                <span>{range.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Study Time"
            value={`${Math.floor(data.overview.totalStudyTime / 60)}h ${data.overview.totalStudyTime % 60}m`}
            change={data.overview.studyTimeChange}
            icon="⏱️"
            color="blue"
          />
          <StatCard
            title="Study Streak"
            value={`${data.overview.studyStreak} days`}
            change={data.overview.streakChange}
            icon="🔥"
            color="orange"
          />
          <StatCard
            title="Goals Progress"
            value={`${data.overview.goalsCompleted}/${data.overview.totalGoals}`}
            change={data.overview.goalsChange}
            icon="🎯"
            color="green"
          />
          <StatCard
            title="Daily Average"
            value={`${Math.floor((data.overview.totalStudyTime / (timeRange === 'week' ? 7 : 30)) / 60)}h ${Math.floor((data.overview.totalStudyTime / (timeRange === 'week' ? 7 : 30)) % 60)}m`}
            icon="📊"
            color="purple"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Yearly Study Heatmap */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Study Activity</h3>
              <div className="text-green-600">📅</div>
            </div>
            <YearlyHeatmap data={data.yearlyData} />
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Subject Breakdown */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Subjects</h3>
                <div className="text-purple-600">📚</div>
              </div>
              <SubjectList data={data.subjectStats} />
            </div>

            {/* Recent Goals */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Active Goals</h3>
                <div className="text-green-600">🎯</div>
              </div>
              <GoalsList goals={data.goalProgress.filter(g => g.status === 'active').slice(0, 3)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, change, icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    orange: 'bg-orange-50 text-orange-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change !== undefined && (
            <p className={`text-sm mt-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? '+' : ''}{change}% from last {title.includes('Week') ? 'week' : 'period'}
            </p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center text-xl`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

// Subject List
const SubjectList = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        <div className="text-2xl mb-2">📚</div>
        <p className="text-sm">No subjects tracked yet</p>
      </div>
    );
  }

  const totalTime = data.reduce((sum, subject) => sum + subject.time, 0);

  return (
    <div className="space-y-3">
      {data.slice(0, 5).map((subject, index) => (
        <div key={index} className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-900">{subject.name}</span>
              <span className="text-sm text-gray-600">{Math.floor(subject.time / 60)}h {subject.time % 60}m</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-500 h-2 rounded-full"
                style={{ width: `${totalTime > 0 ? (subject.time / totalTime) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Goals List
const GoalsList = ({ goals }) => {
  if (!goals || goals.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        <div className="text-2xl mb-2">🎯</div>
        <p className="text-sm">No active goals</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {goals.map((goal, index) => (
        <div key={index} className="border-l-4 border-green-500 pl-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-900 truncate">{goal.title}</span>
            <span className="text-sm text-gray-600">{goal.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full"
              style={{ width: `${goal.progress}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnalyticsDashboard;