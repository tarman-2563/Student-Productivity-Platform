const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://student-productivity-platform.onrender.com/api';

export const getAnalyticsData = async (timeRange = 'week') => {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics?timeRange=${timeRange}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    throw error;
  }
};
