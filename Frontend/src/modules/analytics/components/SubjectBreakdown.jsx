import { useState } from 'react';
import { PieChart, BarChart3 } from '../utils/iconComponents.jsx';
import { formatDuration } from '../utils/analyticsHelpers';

const SubjectBreakdown = ({ data }) => {
  const [viewType, setViewType] = useState('pie'); // pie, bar

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <PieChart className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>No subject data available</p>
        </div>
      </div>
    );
  }

  const totalTime = data.reduce((sum, subject) => sum + subject.time, 0);
  const colors = [
    'bg-blue-500',
    'bg-green-500', 
    'bg-purple-500',
    'bg-orange-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-red-500',
    'bg-yellow-500'
  ];

  return (
    <div className="space-y-4">
      {/* View Toggle */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Total: {formatDuration(totalTime)}
        </div>
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewType('pie')}
            className={`p-2 rounded-md transition-colors ${
              viewType === 'pie'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <PieChart className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewType('bar')}
            className={`p-2 rounded-md transition-colors ${
              viewType === 'bar'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="h-48">
        {viewType === 'pie' ? (
          <PieChartView data={data} totalTime={totalTime} colors={colors} />
        ) : (
          <BarChartView data={data} colors={colors} />
        )}
      </div>

      {/* Legend */}
      <div className="space-y-2 max-h-32 overflow-y-auto">
        {data.map((subject, index) => {
          const percentage = totalTime > 0 ? (subject.time / totalTime) * 100 : 0;
          return (
            <div key={subject.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`}></div>
                <span className="text-gray-700">{subject.name}</span>
              </div>
              <div className="text-right">
                <div className="font-medium text-gray-900">{formatDuration(subject.time)}</div>
                <div className="text-xs text-gray-500">{percentage.toFixed(1)}%</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const PieChartView = ({ data, totalTime, colors }) => {
  let cumulativePercentage = 0;
  
  return (
    <div className="flex items-center justify-center h-full">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="8"
          />
          {data.map((subject, index) => {
            const percentage = totalTime > 0 ? (subject.time / totalTime) * 100 : 0;
            const strokeDasharray = `${percentage * 2.51} ${251.2 - percentage * 2.51}`;
            const strokeDashoffset = -cumulativePercentage * 2.51;
            
            cumulativePercentage += percentage;
            
            const colorMap = {
              'bg-blue-500': '#3B82F6',
              'bg-green-500': '#10B981',
              'bg-purple-500': '#8B5CF6',
              'bg-orange-500': '#F97316',
              'bg-pink-500': '#EC4899',
              'bg-indigo-500': '#6366F1',
              'bg-red-500': '#EF4444',
              'bg-yellow-500': '#EAB308'
            };
            
            return (
              <circle
                key={subject.name}
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke={colorMap[colors[index % colors.length]] || '#6B7280'}
                strokeWidth="8"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-500"
              />
            );
          })}
        </svg>
        
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{data.length}</div>
            <div className="text-xs text-gray-600">subjects</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BarChartView = ({ data, colors }) => {
  const maxTime = Math.max(...data.map(s => s.time));
  
  return (
    <div className="h-full space-y-2 overflow-y-auto">
      {data.map((subject, index) => {
        const width = maxTime > 0 ? (subject.time / maxTime) * 100 : 0;
        
        return (
          <div key={subject.name} className="flex items-center space-x-3">
            <div className="w-16 text-xs text-gray-600 truncate" title={subject.name}>
              {subject.name}
            </div>
            <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
              <div
                className={`h-4 rounded-full transition-all duration-500 ${colors[index % colors.length]}`}
                style={{ width: `${width}%` }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-end pr-2">
                <span className="text-xs font-medium text-white">
                  {formatDuration(subject.time)}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SubjectBreakdown;