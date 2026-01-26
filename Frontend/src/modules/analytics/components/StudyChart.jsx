import { useState } from 'react';
import { BarChart3, LineChart, TrendingUp } from '../utils/iconComponents.jsx';

const StudyChart = ({ data, timeRange }) => {
  const [chartType, setChartType] = useState('bar'); // bar, line

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <BarChart3 className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>No study data available</p>
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value));
  const avgValue = data.reduce((sum, d) => sum + d.value, 0) / data.length;

  return (
    <div className="space-y-4">
      {/* Chart Type Toggle */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <TrendingUp className="w-4 h-4" />
          <span>Average: {Math.round(avgValue)} min/day</span>
        </div>
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setChartType('bar')}
            className={`p-2 rounded-md transition-colors ${
              chartType === 'bar'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setChartType('line')}
            className={`p-2 rounded-md transition-colors ${
              chartType === 'line'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <LineChart className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chart Container */}
      <div className="h-48 relative">
        {chartType === 'bar' ? (
          <BarChartView data={data} maxValue={maxValue} avgValue={avgValue} />
        ) : (
          <LineChartView data={data} maxValue={maxValue} avgValue={avgValue} />
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span className="text-gray-600">Study Time</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-200 rounded"></div>
          <span className="text-gray-600">Average</span>
        </div>
      </div>
    </div>
  );
};

const BarChartView = ({ data, maxValue, avgValue }) => {
  return (
    <div className="h-full flex items-end justify-between space-x-1 px-2">
      {data.map((item, index) => {
        const height = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
        const avgHeight = maxValue > 0 ? (avgValue / maxValue) * 100 : 0;
        const isToday = item.isToday;
        
        return (
          <div key={index} className="flex-1 flex flex-col items-center space-y-2">
            <div className="relative w-full h-40 flex items-end">
              {/* Average line */}
              <div 
                className="absolute w-full border-t-2 border-blue-200 border-dashed"
                style={{ bottom: `${avgHeight}%` }}
              ></div>
              
              {/* Bar */}
              <div
                className={`w-full rounded-t transition-all duration-300 hover:opacity-80 ${
                  isToday 
                    ? 'bg-blue-600' 
                    : item.value > avgValue 
                      ? 'bg-blue-500' 
                      : 'bg-blue-400'
                }`}
                style={{ height: `${height}%` }}
                title={`${item.label}: ${item.value} minutes`}
              ></div>
            </div>
            
            {/* Label */}
            <div className="text-xs text-gray-600 text-center">
              <div className={isToday ? 'font-semibold text-blue-600' : ''}>{item.label}</div>
              <div className="text-gray-500">{item.value}m</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const LineChartView = ({ data, maxValue, avgValue }) => {
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = maxValue > 0 ? 100 - (item.value / maxValue) * 100 : 100;
    return { x, y, ...item };
  });

  const pathData = points.reduce((path, point, index) => {
    const command = index === 0 ? 'M' : 'L';
    return `${path} ${command} ${point.x} ${point.y}`;
  }, '');

  const avgY = maxValue > 0 ? 100 - (avgValue / maxValue) * 100 : 100;

  return (
    <div className="h-full relative">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Average line */}
        <line
          x1="0"
          y1={avgY}
          x2="100"
          y2={avgY}
          stroke="#93C5FD"
          strokeWidth="0.5"
          strokeDasharray="2,2"
        />
        
        {/* Study time line */}
        <path
          d={pathData}
          fill="none"
          stroke="#3B82F6"
          strokeWidth="1"
          className="drop-shadow-sm"
        />
        
        {/* Data points */}
        {points.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="1"
            fill={point.isToday ? "#1D4ED8" : "#3B82F6"}
            className="drop-shadow-sm"
          />
        ))}
      </svg>
      
      {/* Labels */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 -mb-6">
        {data.map((item, index) => (
          <div key={index} className="text-xs text-gray-600 text-center">
            <div className={item.isToday ? 'font-semibold text-blue-600' : ''}>{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudyChart;