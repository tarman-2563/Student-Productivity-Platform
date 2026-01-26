// Analytics API Service
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5757/api';

// Get comprehensive analytics data
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

// Get study statistics
export const getStudyStats = async (dateRange) => {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/study-stats`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ dateRange })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching study stats:', error);
    throw error;
  }
};
// Get productivity insights
export const getProductivityInsights = async (timeRange) => {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/productivity?timeRange=${timeRange}`, {
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
    console.error('Error fetching productivity insights:', error);
    throw error;
  }
};

export const recordStudySession = async (sessionData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/analytics/sessions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(sessionData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error recording study session:', error);
        throw new Error('Failed to record study session');
    }
};