import { useState, useEffect } from 'react';
import { getStudyStats } from '../services/analytics.api';

const useStudyStats = (dateRange) => {
  const [stats, setStats] = useState({
    totalTime: 0,
    averageSession: 0,
    completedTasks: 0,
    productivity: 0,
    subjects: [],
    trends: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const studyStats = await getStudyStats(dateRange);
      setStats(studyStats);
    } catch (err) {
      console.error('Failed to fetch study stats:', err);
      setError(err.message || 'Failed to load study statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (dateRange) {
      fetchStats();
    }
  }, [dateRange]);

  const refetch = () => {
    fetchStats();
  };

  return {
    stats,
    loading,
    error,
    refetch
  };
};

export default useStudyStats;