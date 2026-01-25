import API from "../../../api/axios";

export const getDailyTasks = async (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    const response = await API.get(`/study-tasks?date=${formattedDate}`);
    return response.data;
};

export const createStudyTask = async (taskData) => {
    const response = await API.post("/study-tasks", taskData);
    return response.data;
};

export const updateStudyTask = async (taskId, taskData) => {
    const response = await API.patch(`/study-tasks/${taskId}`, taskData);
    return response.data;
};

export const deleteStudyTask = async (taskId) => {
    const response = await API.delete(`/study-tasks/${taskId}`);
    return response.data;
};

export const completeStudyTask = async (taskId, actualDuration) => {
    const response = await API.patch(`/study-tasks/${taskId}/complete`, {
        actualDuration
    });
    return response.data;
};