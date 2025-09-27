import axios from 'axios';
import { getToken, removeToken } from './auth';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: 'http://localhost:4000/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // If this is a refresh token request or we're already retrying, log out
      if (originalRequest.url.includes('/auth/refresh') || originalRequest._isRetry) {
        removeToken();
        window.location.href = '/login';
        return Promise.reject(error);
      }
      
      originalRequest._isRetry = true;
      
      try {
        // Try to refresh the token
        const { data } = await api.post('/auth/refresh');
        const { token } = data;
        localStorage.setItem('token', token);
        
        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        removeToken();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    // Handle other errors
    if (error.response) {
      // Server responded with an error status code
      const { status, data } = error.response;
      const errorMessage = data?.message || 'An error occurred';
      
      // Show error toast for non-401 errors
      if (status !== 401) {
        toast.error(errorMessage, { position: 'top-right' });
      }
      
      return Promise.reject({
        status,
        message: errorMessage,
        data: data?.data,
      });
    } else if (error.request) {
      // Request was made but no response was received
      toast.error('Network error. Please check your connection.');
      return Promise.reject({
        status: 0,
        message: 'Network error. Please check your internet connection.',
      });
    } else {
      // Something happened in setting up the request
      console.error('API Error:', error.message);
      return Promise.reject({
        status: -1,
        message: 'Request setup error',
      });
    }
  }
);

export default api;
