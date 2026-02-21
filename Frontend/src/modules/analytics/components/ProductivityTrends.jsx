import { TrendingUp, TrendingDown, Minus } from '../utils/iconComponents.jsx';

const ProductivityTrends = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <div className="text-4xl mb-3">📈</div>
          <p className="text-sm">No productivity data available</p>
          <p className="text-xs text-gray-400 mt-1">Complete tasks to see your trends</p>
        </div>
      </div>
    );
  }

  const currentScore = data[data.length - 1]?.score || 0;
  const previousScore = data[data.length - 2]?.score || 0;
  const trend = currentScore - previousScore;
  const averageScore = data.reduce((sum, d) => sum + d.score, 0) / data.length;
  
  const getTrendIcon = () => {
    if (trend > 0) return TrendingUp;
    if (trend < 0) return TrendingDown;
    return Minus;
  };

  const getTrendColor = () => {
    if (trend > 0) return 'text-green-600';
    if (trend < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  const TrendIcon = getTrendIcon();
  const maxScore = Math.max(...data.map(d => d.score), 100);

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">{Math.round(currentScore)}</div>
          <div className="text-xs text-gray-600 mt-1">Current Score</div>
          <div className="text-xs text-gray-500 mt-0.5">{getScoreLabel(currentScore)}</div>
        </div>
        
        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{Math.round(averageScore)}</div>
          <div className="text-xs text-gray-600 mt-1">Weekly Average</div>
          <div className={`text-xs mt-0.5 flex items-center justify-center ${getTrendColor()}`}>
            <TrendIcon className="w-3 h-3 mr-1" />
            <span>{trend > 0 ? '+' : ''}{Math.round(trend)}</span>
          </div>
        </div>
        
        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{data.length}</div>
          <div className="text-xs text-gray-600 mt-1">Days Tracked</div>
          <div className="text-xs text-gray-500 mt-0.5">This Period</div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-900">Daily Breakdown</h4>
        <div className="space-y-3">
          {data.map((point, index) => {
            const date = new Date(point.date);
            const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
            const isToday = date.toDateString() === new Date().toDateString();
            
            return (
              <div key={index} className="flex items-center space-x-3">
                <div className={`text-xs font-medium w-20 text-right ${isToday ? 'text-orange-600' : 'text-gray-600'}`}>
                  {dayLabel}
                </div>
                <div className="flex-1 flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                    <div 
                      className={`h-6 rounded-full transition-all duration-500 ${getScoreColor(point.score)}`}
                      style={{ width: `${(point.score / maxScore) * 100}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white opacity-20"></div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-gray-900 w-10 text-right">
                    {Math.round(point.score)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Score Breakdown */}
      {data[data.length - 1]?.breakdown && (
        <div className="space-y-3 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900">Today's Score Breakdown</h4>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Task Completion', value: data[data.length - 1]?.breakdown?.completion || 0, icon: '✓' },
              { label: 'Time Management', value: data[data.length - 1]?.breakdown?.timeManagement || 0, icon: '⏰' },
              { label: 'Goal Progress', value: data[data.length - 1]?.breakdown?.goalProgress || 0, icon: '🎯' },
              { label: 'Consistency', value: data[data.length - 1]?.breakdown?.consistency || 0, icon: '🔥' }
            ].map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-600">{item.label}</span>
                  <span className="text-lg">{item.icon}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${item.value}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Productivity Factors */}
      {data[data.length - 1]?.factors && data[data.length - 1].factors.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900">Key Impact Factors</h4>
          <div className="space-y-2">
            {data[data.length - 1].factors.map((factor, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    factor.impact > 0 ? 'bg-green-500' : 
                    factor.impact < 0 ? 'bg-red-500' : 'bg-gray-400'
                  }`}></div>
                  <span className="text-sm text-gray-700">{factor.name}</span>
                </div>
                <div className={`text-sm font-semibold ${
                  factor.impact > 0 ? 'text-green-600' : 
                  factor.impact < 0 ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {factor.impact > 0 ? '+' : ''}{Math.round(factor.impact)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductivityTrends;