import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5757/api"
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Add response interceptor to handle 401 errors
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token is invalid or expired
            console.log('🔒 Authentication required. Please log in again.');
            localStorage.removeItem('token');
            // Reload to trigger login screen
            window.location.reload();
        }
        return Promise.reject(error);
    }
);

export default API;