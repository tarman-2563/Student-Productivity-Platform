import API from '../../../api/axios';

export const createResource = async (formData) => {
    try {
        const response = await API.post('/resources', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        if (error.response?.data) {
            console.error('Resource creation failed:', error.response.data);
        }
        throw new Error(error.response?.data?.message || error.response?.data?.errors?.join(', ') || 'Failed to create resource');
    }
};

export const getResources = async (filters = {}) => {
    try {
        const params = new URLSearchParams(filters);
        const response = await API.get(`/resources?${params}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching resources:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch resources');
    }
};

export const getResourceById = async (resourceId) => {
    try {
        const response = await API.get(`/resources/${resourceId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching resource:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch resource');
    }
};

export const updateResource = async (resourceId, updates) => {
    try {
        const response = await API.put(`/resources/${resourceId}`, updates);
        return response.data;
    } catch (error) {
        console.error('Error updating resource:', error);
        throw new Error(error.response?.data?.message || 'Failed to update resource');
    }
};

export const deleteResource = async (resourceId) => {
    try {
        const response = await API.delete(`/resources/${resourceId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting resource:', error);
        throw new Error(error.response?.data?.message || 'Failed to delete resource');
    }
};

export const toggleFavorite = async (resourceId) => {
    try {
        const response = await API.patch(`/resources/${resourceId}/favorite`);
        return response.data;
    } catch (error) {
        console.error('Error toggling favorite:', error);
        throw new Error(error.response?.data?.message || 'Failed to toggle favorite');
    }
};

export const getResourceStats = async () => {
    try {
        const response = await API.get('/resources/stats');
        return response.data;
    } catch (error) {
        console.error('Error fetching resource stats:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch resource stats');
    }
};
