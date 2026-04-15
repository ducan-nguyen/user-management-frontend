import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Flag để tránh refresh token nhiều lần
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000
});

// Helper functions
const getAccessToken = () => localStorage.getItem('accessToken');
const getRefreshToken = () => localStorage.getItem('refreshToken');
const setTokens = (accessToken, refreshToken) => {
  if (accessToken) localStorage.setItem('accessToken', accessToken);
  if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
};
const clearTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  localStorage.removeItem('tokenExpiry');
};
const isTokenExpired = () => {
  const expiry = localStorage.getItem('tokenExpiry');
  if (!expiry) return true;
  return Date.now() > parseInt(expiry);
};

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    // Log request
    console.log(`${config.method.toUpperCase()} ${config.url}`, config.data || '');
    
    let token = getAccessToken();
    
    // Kiểm tra token có hết hạn không
    if (token && isTokenExpired()) {
      console.log('Token expired, attempting to refresh...');
      
      if (!isRefreshing) {
        isRefreshing = true;
        
        try {
          const refreshToken = getRefreshToken();
          if (!refreshToken) {
            throw new Error('No refresh token available');
          }
          
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken
          });
          
          if (response.data.accessToken) {
            setTokens(response.data.accessToken, response.data.refreshToken);
            token = response.data.accessToken;
            processQueue(null, token);
            console.log('Token refreshed successfully');
          }
        } catch (error) {
          console.error('Refresh token failed:', error);
          processQueue(error, null);
          clearTokens();
          window.location.href = '/login';
          return Promise.reject(error);
        } finally {
          isRefreshing = false;
        }
      }
      
      // Đợi refresh token hoàn tất
      if (isRefreshing) {
        await new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        });
        token = getAccessToken();
      }
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`${response.status} ${response.config.url}`);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Nếu lỗi 401 và chưa thử refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token');
        }
        
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken
        });
        
        if (response.data.accessToken) {
          setTokens(response.data.accessToken, response.data.refreshToken);
          originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Refresh token failed:', refreshError);
        clearTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    // Xử lý các lỗi khác
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      
      console.log(`${status} ${error.config?.url}:`, data);
      
      switch (status) {
        case 400:
          if (data?.message) {
            toast.error(data.message);
          } else if (typeof data === 'object') {
            // Validation errors
            Object.values(data).forEach(msg => {
              if (typeof msg === 'string') toast.error(msg);
            });
          } else {
            toast.error('Invalid request. Please check your input.');
          }
          break;
          
        case 401:
          // Đã xử lý ở trên, không cần xử lý thêm
          break;
          
        case 403:
          toast.error('You do not have permission to perform this action.');
          break;
          
        case 404:
          toast.error(data?.message || 'Resource not found.');
          break;
          
        case 409:
          toast.error(data?.message || 'Resource already exists.');
          break;
          
        case 500:
          console.error('Server error:', data);
          toast.error(data?.message || 'Server error. Please try again later.');
          break;
          
        default:
          toast.error(data?.message || `Error ${status}: An error occurred.`);
      }
    } else if (error.request) {
      console.error('No response received:', error.request);
      toast.error('Cannot connect to server. Please check your connection.');
    } else {
      console.error('Request error:', error.message);
      toast.error('An unexpected error occurred.');
    }
    
    return Promise.reject(error);
  }
);

export default api;