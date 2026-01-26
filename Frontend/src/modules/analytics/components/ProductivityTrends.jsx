import { TrendingUp, TrendingDown, Minus } from '../utils/iconComponents.jsx';

const ProductivityTrends = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <TrendingUp className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>No productivity data available</p>
        </div>
      </div>
    );
  }

  const currentScore = data[data.length - 1]?.score || 0;
  const previousScore = data[data.length - 2]?.score || 0;
  const trend = currentScore - previousScore;
  
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
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  const TrendIcon = getTrendIcon();

  return (
    <div className="space-y-6">
      {/* Current Score */}
      <div className="text-center">
        <div className={`text-3xl font-bold mb-1 ${getScoreColor(currentScore)}`}>
          {currentScore}
        </div>
        <div className="text-sm text-gray-600 mb-2">{getScoreLabel(currentScore)}</div>
        
        {/* Trend Indicator */}
        <div className={`flex items-center justify-center space-x-1 text-sm ${getTrendColor()}`}>
          <TrendIcon className="w-4 h-4" />
          <span>
            {trend > 0 ? '+' : ''}{trend.toFixed(1)} from last period
          </span>
        </div>
      </div>

      {/* Mini Chart */}
      <div className="h-20 relative">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Grid lines */}
          {[25, 50, 75].map(y => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="100"
              y2={y}
              stroke="#E5E7EB"
              strokeWidth="0.5"
            />
          ))}
          
          {/* Trend line */}
          {data.length > 1 && (
            <polyline
              points={data.map((point, index) => {
                const x = (index / (data.length - 1)) * 100;
                const y = 100 - point.score;
                return `${x},${y}`;
              }).join(' ')}
              fill="none"
              stroke="#F97316"
              strokeWidth="2"
              className="drop-shadow-sm"
            />
          )}
          
          {/* Data points */}
          {data.map((point, index) => {
            const x = data.length > 1 ? (index / (data.length - 1)) * 100 : 50;
            const y = 100 - point.score;
            const isLatest = index === data.length - 1;
            
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r={isLatest ? "2" : "1.5"}
                fill={isLatest ? "#EA580C" : "#F97316"}
                className="drop-shadow-sm"
              />
            );
          })}
        </svg>
      </div>

      {/* Productivity Factors */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-900">Key Factors</h4>
        {data[data.length - 1]?.factors?.map((factor, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                factor.impact > 0 ? 'bg-green-500' : 
                factor.impact < 0 ? 'bg-red-500' : 'bg-gray-400'
              }`}></div>
              <span className="text-gray-700">{factor.name}</span>
            </div>
            <div className={`font-medium ${
              factor.impact > 0 ? 'text-green-600' : 
              factor.impact < 0 ? 'text-red-600' : 'text-gray-600'
            }`}>
              {factor.impact > 0 ? '+' : ''}{factor.impact}
            </div>
          </div>
        )) || (
          <div className="text-center py-4 text-gray-500 text-sm">
            No factor data available
          </div>
        )}
      </div>

      {/* Score Breakdown */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-900">Score Breakdown</h4>
        <div className="space-y-2">
          {[
            { label: 'Task Completion', value: data[data.length - 1]?.breakdown?.completion || 0 },
            { label: 'Time Management', value: data[data.length - 1]?.breakdown?.timeManagement || 0 },
            { label: 'Goal Progress', value: data[data.length - 1]?.breakdown?.goalProgress || 0 },
            { label: 'Consistency', value: data[data.length - 1]?.breakdown?.consistency || 0 }
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{item.label}</span>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-orange-500 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${item.value}%` }}
                  ></div>
                </div>
                <span className="text-gray-900 font-medium w-8 text-right">{item.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductivityTrends;