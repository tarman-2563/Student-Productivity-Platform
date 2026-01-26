import API from "../../../api/axios";

export const getDailyTasks = async (date) => {
    try {
        const formattedDate = date.toISOString().split("T")[0];
        const response = await API.get(`/study-tasks?date=${formattedDate}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching daily tasks:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch tasks');
    }
};

export const createStudyTask = async (taskData) => {
    try {
        const response = await API.post("/study-tasks", taskData);
        return response.data;
    } catch (error) {
        console.error('Error creating task:', error);
        throw new Error(error.response?.data?.message || 'Failed to create task');
    }
};

export const updateStudyTask = async (taskId, taskData) => {
    try {
        const response = await API.patch(`/study-tasks/${taskId}`, taskData);
        return response.data;
    } catch (error) {
        console.error('Error updating task:', error);
        throw new Error(error.response?.data?.message || 'Failed to update task');
    }
};

export const deleteStudyTask = async (taskId) => {
    try {
        const response = await API.delete(`/study-tasks/${taskId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting task:', error);
        throw new Error(error.response?.data?.message || 'Failed to delete task');
    }
};

export const completeStudyTask = async (taskId, actualDuration) => {
    try {
        const response = await API.patch(`/study-tasks/${taskId}/complete`, {
            actualDuration
        });
        return response.data;
    } catch (error) {
        console.error('Error completing task:', error);
        throw new Error(error.response?.data?.message || 'Failed to complete task');
    }
};