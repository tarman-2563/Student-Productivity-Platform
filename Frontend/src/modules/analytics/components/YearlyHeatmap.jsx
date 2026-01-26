import { useState, useEffect } from 'react';

const YearlyHeatmap = ({ data }) => {
  const [hoveredDay, setHoveredDay] = useState(null);
  const [currentYear] = useState(new Date().getFullYear());

  // Generate all days of the year
  const generateYearDays = (year) => {
    const days = [];
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }
    
    return days;
  };

  // Get study data for a specific date
  const getStudyDataForDate = (date) => {
    if (!data || !Array.isArray(data)) return 0;
    
    const dateStr = date.toISOString().split('T')[0];
    const dayData = data.find(d => d.date === dateStr);
    return dayData ? dayData.studyTime : 0;
  };

  // Get intensity level based on study time
  const getIntensityLevel = (studyTime) => {
    if (studyTime === 0) return 0;
    if (studyTime < 30) return 1;   // < 30 minutes
    if (studyTime < 60) return 2;   // 30-60 minutes
    if (studyTime < 120) return 3;  // 1-2 hours
    return 4; // 2+ hours
  };

  // Get color class based on intensity
  const getColorClass = (level) => {
    const colors = {
      0: 'bg-gray-200 hover:bg-gray-300 border-gray-300',
      1: 'bg-green-200 hover:bg-green-300 border-green-300',
      2: 'bg-green-400 hover:bg-green-500 border-green-500',
      3: 'bg-green-600 hover:bg-green-700 border-green-700',
      4: 'bg-green-800 hover:bg-green-900 border-green-900'
    };
    return colors[level] || colors[0];
  };

  const yearDays = generateYearDays(currentYear);
  const today = new Date();
  
  // Group days by weeks
  const weeks = [];
  let currentWeek = [];
  
  // Add empty cells for days before the year starts
  const firstDay = yearDays[0];
  const startDayOfWeek = firstDay.getDay();
  
  for (let i = 0; i < startDayOfWeek; i++) {
    currentWeek.push(null);
  }
  
  yearDays.forEach((day, index) => {
    currentWeek.push(day);
    
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });
  
  // Add the last partial week if it exists
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatStudyTime = (minutes) => {
    if (minutes === 0) return 'No study time';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}m` : ''}`;
    }
    return `${mins}m`;
  };

  return (
    <div className="relative">
      {/* Month labels */}
      <div className="flex justify-between mb-2 text-xs text-gray-600">
        {months.map((month, index) => (
          <span key={month} className="flex-1 text-center">
            {month}
          </span>
        ))}
      </div>

      {/* Heatmap grid */}
      <div className="relative">
        {/* Day labels */}
        <div className="absolute -left-8 top-0 flex flex-col justify-around h-full text-xs text-gray-600">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-53 gap-1 ml-4">
          {weeks.map((week, weekIndex) => 
            week.map((day, dayIndex) => {
              if (!day) {
                return (
                  <div 
                    key={`empty-${weekIndex}-${dayIndex}`} 
                    className="w-3 h-3"
                  />
                );
              }

              const studyTime = getStudyDataForDate(day);
              const intensity = getIntensityLevel(studyTime);
              const isToday = day.toDateString() === today.toDateString();
              const isFuture = day > today;

              return (
                <div
                  key={day.toISOString()}
                  className={`
                    w-3 h-3 rounded-sm cursor-pointer transition-all duration-200 border-2
                    ${getColorClass(intensity)}
                    ${isToday ? 'ring-2 ring-blue-500 ring-offset-1' : ''}
                    ${isFuture ? 'opacity-50' : ''}
                  `}
                  onMouseEnter={() => setHoveredDay({ day, studyTime })}
                  onMouseLeave={() => setHoveredDay(null)}
                  title={`${formatDate(day)}: ${formatStudyTime(studyTime)}`}
                />
              );
            })
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-4 text-xs text-gray-600">
        <span>Less</span>
        <div className="flex items-center space-x-1">
          {[0, 1, 2, 3, 4].map(level => (
            <div
              key={level}
              className={`w-3 h-3 rounded-sm border-2 ${getColorClass(level)}`}
            />
          ))}
        </div>
        <span>More</span>
      </div>

      {/* Tooltip */}
      {hoveredDay && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
          <div className="font-medium">{formatDate(hoveredDay.day)}</div>
          <div>{formatStudyTime(hoveredDay.studyTime)}</div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
        </div>
      )}

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div>
          <div className="text-lg font-bold text-gray-900">
            {data ? data.filter(d => d.studyTime > 0).length : 0}
          </div>
          <div className="text-xs text-gray-600">Days studied</div>
        </div>
        <div>
          <div className="text-lg font-bold text-gray-900">
            {data ? Math.max(...data.map(d => d.studyTime), 0) : 0}m
          </div>
          <div className="text-xs text-gray-600">Longest session</div>
        </div>
        <div>
          <div className="text-lg font-bold text-gray-900">
            {data ? Math.round(data.reduce((sum, d) => sum + d.studyTime, 0) / data.filter(d => d.studyTime > 0).length) || 0 : 0}m
          </div>
          <div className="text-xs text-gray-600">Average session</div>
        </div>
        <div>
          <div className="text-lg font-bold text-gray-900">
            {currentYear}
          </div>
          <div className="text-xs text-gray-600">Current year</div>
        </div>
      </div>
    </div>
  );
};

export default YearlyHeatmap;