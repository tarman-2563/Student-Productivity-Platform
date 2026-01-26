import { Clock, Target, TrendingUp, Calendar } from '../utils/iconComponents.jsx';
import { formatDuration, formatPercentage } from '../utils/analyticsHelpers';

const StatsOverview = ({ stats, timeRange }) => {
  const statCards = [
    {
      title: 'Total Study Time',
      value: formatDuration(stats.totalStudyTime),
      change: stats.studyTimeChange,
      icon: Clock,
      color: 'blue',
      suffix: 'hours'
    },
    {
      title: 'Goals Completed',
      value: stats.goalsCompleted,
      change: stats.goalsChange,
      icon: Target,
      color: 'green',
      suffix: `of ${stats.totalGoals}`
    },
    {
      title: 'Productivity Score',
      value: stats.productivityScore,
      change: stats.productivityChange,
      icon: TrendingUp,
      color: 'orange',
      suffix: '/100'
    },
    {
      title: 'Study Streak',
      value: stats.studyStreak,
      change: stats.streakChange,
      icon: Calendar,
      color: 'purple',
      suffix: 'days'
    }
  ];

  const getChangeColor = (change) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getChangeIcon = (change) => {
    if (change > 0) return '↗';
    if (change < 0) return '↘';
    return '→';
  };

  const getTimeRangeLabel = (range) => {
    switch (range) {
      case 'week': return 'this week';
      case 'month': return 'this month';
      case 'quarter': return 'this quarter';
      case 'year': return 'this year';
      default: return 'this period';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        const colorClasses = {
          blue: 'bg-blue-100 text-blue-600',
          green: 'bg-green-100 text-green-600',
          orange: 'bg-orange-100 text-orange-600',
          purple: 'bg-purple-100 text-purple-600'
        };

        return (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg ${colorClasses[stat.color]} flex items-center justify-center`}>
                <Icon className="w-6 h-6" />
              </div>
              {stat.change !== undefined && (
                <div className={`flex items-center text-sm ${getChangeColor(stat.change)}`}>
                  <span className="mr-1">{getChangeIcon(stat.change)}</span>
                  <span>{Math.abs(stat.change)}%</span>
                </div>
              )}
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <div className="flex items-baseline space-x-2">
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                {stat.suffix && (
                  <p className="text-sm text-gray-500">{stat.suffix}</p>
                )}
              </div>
              {stat.change !== undefined && (
                <p className="text-xs text-gray-500">
                  vs {getTimeRangeLabel(timeRange)}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsOverview;