import { useState, useEffect } from 'react';
import { getAnalyticsData } from '../services/analytics.api';

const useAnalytics = (timeRange = 'week') => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const analyticsData = await getAnalyticsData(timeRange);
      
      // Provide default structure if data is missing
      const defaultData = {
        overview: {
          totalStudyTime: 0,
          studyTimeChange: 0,
          goalsCompleted: 0,
          totalGoals: 0,
          goalsChange: 0,
          studyStreak: 0,
          streakChange: 0
        },
        productivityTrends: []
      };
      
      setData({ ...defaultData, ...analyticsData });
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
      setError(err.message || 'Failed to load analytics data');
      
      // Set empty data structure on error
      setData({
        overview: {
          totalStudyTime: 0,
          studyTimeChange: 0,
          goalsCompleted: 0,
          totalGoals: 0,
          goalsChange: 0,
          studyStreak: 0,
          streakChange: 0
        },
        productivityTrends: []
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const refetch = () => {
    fetchAnalytics();
  };

  return {
    data,
    loading,
    error,
    refetch
  };
};

export default useAnalytics;