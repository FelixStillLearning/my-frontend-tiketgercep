import axios from 'axios';

// Base URL untuk backend API
const API_BASE_URL = 'http://localhost:5000/api';

// Membuat instance axios dengan konfigurasi default
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor - untuk menambahkan token authorization jika ada
api.interceptors.request.use(
  (config) => {
    // Jika ada token di localStorage, tambahkan ke header
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request untuk debugging
    console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`, config.data || '');
    
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - untuk handle response dan error secara global
api.interceptors.response.use(
  (response) => {
    // Log successful response
    console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    // Handle error responses
    console.error('❌ Response Error:', error.response?.data || error.message);
    
    // Jika token expired (401), redirect ke login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Uncomment jika ada routing ke login
      // window.location.href = '/login';
    }
    
    // Jika server error (500), tampilkan pesan user-friendly
    if (error.response?.status >= 500) {
      console.error('Server sedang bermasalah. Silakan coba lagi nanti.');
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

// Export default axios instance
export default api;

// Export base URL untuk kebutuhan lain
export { API_BASE_URL };