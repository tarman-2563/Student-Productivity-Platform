import API from '../../../api/axios';

export const getGoals = async () => {
    try {
        const response = await API.get('/goals');
        return response.data;
    } catch (error) {
        console.error('Error fetching goals:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch goals');
    }
};

export const getGoalById = async (goalId) => {
    try {
        const response = await API.get(`/goals/${goalId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching goal:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch goal');
    }
};

export const createGoal = async (goalData) => {
    try {
        const response = await API.post('/goals', goalData);
        return response.data;
    } catch (error) {
        console.error('Error creating goal:', error);
        throw new Error(error.response?.data?.message || 'Failed to create goal');
    }
};

export const updateGoal = async (goalId, updates) => {
    try {
        const response = await API.put(`/goals/${goalId}`, updates);
        return response.data;
    } catch (error) {
        console.error('Error updating goal:', error);
        throw new Error(error.response?.data?.message || 'Failed to update goal');
    }
};

export const deleteGoal = async (goalId) => {
    try {
        const response = await API.delete(`/goals/${goalId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting goal:', error);
        throw new Error(error.response?.data?.message || 'Failed to delete goal');
    }
};

export const updateMilestone = async (goalId, milestoneId, completed) => {
    try {
        const response = await API.patch(`/goals/${goalId}/milestones/${milestoneId}`, { completed });
        return response.data;
    } catch (error) {
        console.error('Error updating milestone:', error);
        throw new Error(error.response?.data?.message || 'Failed to update milestone');
    }
};

export const getGoalStats = async () => {
    try {
        const response = await API.get('/goals/stats');
        return response.data;
    } catch (error) {
        console.error('Error fetching goal stats:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch goal stats');
    }
};

export const addProgressLog = async (goalId, progressData) => {
    try {
        const response = await API.post(`/goals/${goalId}/progress`, progressData);
        return response.data;
    } catch (error) {
        console.error('Error adding progress log:', error);
        throw new Error(error.response?.data?.message || 'Failed to add progress log');
    }
};