import { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from '../utils/iconComponents.jsx';

const WeeklyHeatmap = ({ data }) => {
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>No activity data available</p>
        </div>
      </div>
    );
  }

  // Generate weeks data (last 12 weeks)
  const weeks = generateWeeksData(data, currentWeekOffset);
  const maxValue = Math.max(...data.map(d => d.value));

  const getIntensityClass = (day) => {
    if (day.isFuture) return 'bg-gray-50 border border-gray-200'; // Future dates
    if (day.value === 0) return 'bg-gray-100';
    
    const intensity = day.value / maxValue;
    let baseClass = '';
    if (intensity >= 0.8) baseClass = 'bg-indigo-600';
    else if (intensity >= 0.6) baseClass = 'bg-indigo-500';
    else if (intensity >= 0.4) baseClass = 'bg-indigo-400';
    else if (intensity >= 0.2) baseClass = 'bg-indigo-300';
    else baseClass = 'bg-indigo-200';
    
    // Add today highlight
    if (day.isToday) {
      return `${baseClass} ring-2 ring-blue-500 ring-offset-1`;
    }
    
    return baseClass;
  };

  const getDayLabel = (dayIndex) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[dayIndex];
  };

  const getMonthLabel = (date) => {
    return date.toLocaleDateString('en-US', { month: 'short' });
  };

  const goToPreviousWeeks = () => {
    setCurrentWeekOffset(prev => prev + 12);
  };

  const goToNextWeeks = () => {
    setCurrentWeekOffset(prev => Math.max(0, prev - 12));
  };

  const goToCurrentWeeks = () => {
    setCurrentWeekOffset(0);
  };

  return (
    <div className="space-y-4">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={goToPreviousWeeks}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
            title="Previous 12 weeks"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={goToNextWeeks}
            disabled={currentWeekOffset === 0}
            className="p-1 rounded hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Next 12 weeks"
          >
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
          {currentWeekOffset > 0 && (
            <button
              onClick={goToCurrentWeeks}
              className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors"
            >
              Current
            </button>
          )}
        </div>
        
        <div className="text-sm text-gray-600">
          {currentWeekOffset === 0 ? 'Last 12 weeks (up to today)' : `${currentWeekOffset + 1}-${currentWeekOffset + 12} weeks ago`}
        </div>
      </div>

      {/* Heatmap */}
      <div className="overflow-x-auto">
        <div className="inline-flex flex-col space-y-1 min-w-full">
          {/* Day labels */}
          <div className="flex items-center space-x-1 mb-2">
            <div className="w-8"></div> {/* Spacer for day labels */}
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col items-center space-y-1">
                {weekIndex % 4 === 0 && (
                  <div className="text-xs text-gray-500 h-4">
                    {getMonthLabel(week[0].date)}
                  </div>
                )}
                {weekIndex % 4 !== 0 && <div className="h-4"></div>}
              </div>
            ))}
          </div>

          {/* Heatmap grid */}
          {[0, 1, 2, 3, 4, 5, 6].map(dayIndex => (
            <div key={dayIndex} className="flex items-center space-x-1">
              {/* Day label */}
              <div className="w-8 text-xs text-gray-500 text-right pr-2">
                {dayIndex % 2 === 1 ? getDayLabel(dayIndex) : ''}
              </div>
              
              {/* Week cells */}
              {weeks.map((week, weekIndex) => {
                const day = week[dayIndex];
                return (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className={`w-3 h-3 rounded-sm ${getIntensityClass(day)} hover:ring-2 hover:ring-indigo-300 transition-all cursor-pointer`}
                    title={day.isFuture ? 
                      `${day.date.toLocaleDateString()}: Future date` :
                      `${day.date.toLocaleDateString()}: ${day.value} minutes${day.isToday ? ' (Today)' : ''}`
                    }
                  ></div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">Less</span>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-gray-100 rounded-sm"></div>
              <div className="w-3 h-3 bg-indigo-200 rounded-sm"></div>
              <div className="w-3 h-3 bg-indigo-300 rounded-sm"></div>
              <div className="w-3 h-3 bg-indigo-400 rounded-sm"></div>
              <div className="w-3 h-3 bg-indigo-500 rounded-sm"></div>
              <div className="w-3 h-3 bg-indigo-600 rounded-sm"></div>
            </div>
            <span className="text-gray-600">More</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-400 rounded-sm ring-2 ring-blue-500 ring-offset-1"></div>
            <span className="text-gray-600 text-xs">Today</span>
          </div>
        </div>
        
        <div className="text-gray-500">
          {data.filter(d => d.value > 0).length} active days
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">
            {Math.round(data.reduce((sum, d) => sum + d.value, 0) / data.length)}
          </div>
          <div className="text-xs text-gray-600">Avg per day</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">
            {Math.max(...data.map(d => d.value))}
          </div>
          <div className="text-xs text-gray-600">Best day</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">
            {data.filter(d => d.value > 0).length}
          </div>
          <div className="text-xs text-gray-600">Active days</div>
        </div>
      </div>
    </div>
  );
};

const generateWeeksData = (data, weekOffset) => {
  const weeks = [];
  const today = new Date();
  today.setHours(23, 59, 59, 999); // End of today
  
  // Calculate how many complete weeks we can show ending with today
  const todayDayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
  const endDate = new Date(today);
  
  // Calculate start date: go back enough days to show 12 complete weeks ending today
  const totalDaysToShow = 84; // 12 weeks * 7 days
  const startDate = new Date(endDate);
  startDate.setDate(endDate.getDate() - totalDaysToShow + 1);
  startDate.setHours(0, 0, 0, 0);
  
  // Apply week offset for navigation
  if (weekOffset > 0) {
    startDate.setDate(startDate.getDate() - (weekOffset * 7));
    endDate.setDate(endDate.getDate() - (weekOffset * 7));
  }
  
  // Generate weeks starting from the calculated start date
  for (let week = 0; week < 12; week++) {
    const weekData = [];
    for (let day = 0; day < 7; day++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + (week * 7) + day);
      
      // Only include dates that don't exceed our end date
      if (currentDate <= endDate) {
        // Find matching data point
        const dataPoint = data.find(d => 
          new Date(d.date).toDateString() === currentDate.toDateString()
        );
        
        weekData.push({
          date: new Date(currentDate),
          value: dataPoint ? dataPoint.value : 0,
          isToday: currentDate.toDateString() === new Date().toDateString(),
          isFuture: currentDate > new Date()
        });
      } else {
        // For future dates, show empty
        weekData.push({
          date: new Date(currentDate),
          value: 0,
          isToday: false,
          isFuture: true
        });
      }
    }
    weeks.push(weekData);
  }
  
  return weeks;
};

export default WeeklyHeatmap;