import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`${config.method.toUpperCase()} ${config.url}`, config.data || '');
    const token = localStorage.getItem('token');
    console.log("TOKEN:", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`${response.status} ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      
      console.log(`${status} ${error.config?.url}:`, data);
      
      // Xử lý theo status code
      switch (status) {
        case 400: // Bad Request - Validation errors
          toast.error('Please check your input');
          break;
          
        case 401: // Unauthorized
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          toast.error('Session expired');
          break;
          
        case 403: // Forbidden
          toast.error('You do not have permission');
          break;
          
        case 404: // Not Found
          toast.error('Resource not found');
          break;
          
        case 409: // Conflict - Already exists
          console.log('Conflict error:', data.message);
          break;
          
        case 500: // Server error
          toast.error('Server error. Please try again later');
          break;
          
        default:
          toast.error(data?.message || 'An error occurred');
      }
    } else if (error.request) {
      console.log('No response received');
      toast.error('Cannot connect to server');
    }
    
    return Promise.reject(error);
  }
);

export default api;