import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Helper function untuk handle API calls dengan error handling
export const apiCall = async (apiFunction) => {
    try {
        const response = await apiFunction();
        return {
            success: true,
            data: response.data,
            error: null
        };
    } catch (error) {
        return {
            success: false,
            data: null,
            error: error.response?.data?.message || error.message || 'Something went wrong'
        };
    }
};

export default api;