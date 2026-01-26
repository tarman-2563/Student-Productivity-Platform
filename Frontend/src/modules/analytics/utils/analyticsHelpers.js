// Analytics utility functions

// Format duration from minutes to human readable format
export const formatDuration = (minutes) => {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${remainingMinutes}m`;
};

// Format percentage with one decimal place
export const formatPercentage = (value) => {
  return `${Math.round(value * 10) / 10}%`;
};

// Calculate percentage change
export const calculatePercentageChange = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

// Get time range dates
export const getTimeRangeDates = (range) => {
  const end = new Date();
  const start = new Date();
  
  switch (range) {
    case 'week':
      start.setDate(end.getDate() - 7);
      break;
    case 'month':
      start.setMonth(end.getMonth() - 1);
      break;
    case 'quarter':
      start.setMonth(end.getMonth() - 3);
      break;
    case 'year':
      start.setFullYear(end.getFullYear() - 1);
      break;
    default:
      start.setDate(end.getDate() - 7);
  }
  
  return { start, end };
};

// Calculate productivity score based on various factors
export const calculateProductivityScore = (factors) => {
  const {
    tasksCompleted = 0,
    totalTasks = 1,
    studyTime = 0,
    plannedTime = 1,
    goalsProgress = 0,
    consistency = 0
  } = factors;
  
  const completionRate = (tasksCompleted / totalTasks) * 100;
  const timeEfficiency = Math.min((studyTime / plannedTime) * 100, 100);
  const goalScore = goalsProgress;
  const consistencyScore = consistency;
  
  // Weighted average
  const score = (
    completionRate * 0.3 +
    timeEfficiency * 0.25 +
    goalScore * 0.25 +
    consistencyScore * 0.2
  );
  
  return Math.round(Math.min(Math.max(score, 0), 100));
};

// Group data by time period
export const groupDataByPeriod = (data, period) => {
  const grouped = {};
  
  data.forEach(item => {
    const date = new Date(item.date);
    let key;
    
    switch (period) {
      case 'day':
        key = date.toDateString();
        break;
      case 'week':
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toDateString();
        break;
      case 'month':
        key = `${date.getFullYear()}-${date.getMonth()}`;
        break;
      case 'year':
        key = date.getFullYear().toString();
        break;
      default:
        key = date.toDateString();
    }
    
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(item);
  });
  
  return grouped;
};

// Calculate study streak
export const calculateStudyStreak = (studyData) => {
  if (!studyData || studyData.length === 0) return 0;
  
  // Sort by date descending
  const sortedData = [...studyData].sort((a, b) => new Date(b.date) - new Date(a.date));
  
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (let i = 0; i < sortedData.length; i++) {
    const studyDate = new Date(sortedData[i].date);
    studyDate.setHours(0, 0, 0, 0);
    
    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() - i);
    
    if (studyDate.getTime() === expectedDate.getTime() && sortedData[i].studyTime > 0) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};

// Get study insights based on data patterns
export const getStudyInsights = (data) => {
  if (!data || data.length === 0) return [];
  
  const insights = [];
  const totalTime = data.reduce((sum, d) => sum + (d.studyTime || 0), 0);
  const avgTime = totalTime / data.length;
  const activeDays = data.filter(d => (d.studyTime || 0) > 0).length;
  
  // Consistency insight
  if (activeDays / data.length >= 0.8) {
    insights.push({
      type: 'positive',
      title: 'Great Consistency!',
      description: `You've been active ${activeDays} out of ${data.length} days.`
    });
  } else if (activeDays / data.length < 0.5) {
    insights.push({
      type: 'suggestion',
      title: 'Improve Consistency',
      description: 'Try to study a little bit every day, even if just for 15 minutes.'
    });
  }
  
  // Time management insight
  const recentAvg = data.slice(-7).reduce((sum, d) => sum + (d.studyTime || 0), 0) / 7;
  const overallAvg = avgTime;
  
  if (recentAvg > overallAvg * 1.2) {
    insights.push({
      type: 'positive',
      title: 'Trending Up!',
      description: 'Your recent study time is above your average. Keep it up!'
    });
  } else if (recentAvg < overallAvg * 0.8) {
    insights.push({
      type: 'warning',
      title: 'Study Time Declining',
      description: 'Your recent study time is below average. Consider adjusting your schedule.'
    });
  }
  
  return insights;
};

// Format time for display in different contexts
export const formatTimeForContext = (minutes, context = 'default') => {
  switch (context) {
    case 'short':
      return minutes < 60 ? `${minutes}m` : `${Math.round(minutes / 60)}h`;
    case 'detailed':
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      if (hours === 0) return `${mins} minutes`;
      if (mins === 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
      return `${hours} hour${hours > 1 ? 's' : ''} ${mins} minutes`;
    case 'compact':
      return minutes < 60 ? `${minutes}` : `${(minutes / 60).toFixed(1)}`;
    default:
      return formatDuration(minutes);
  }
};