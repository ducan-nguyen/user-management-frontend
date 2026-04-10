import api from './api';

const authService = {
  async login(username, password) {
    try {
      const response = await api.post('/auth/login', { username, password });
      
      if (response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.data));
        
        const expiresIn = response.data.expiresIn || 3600000;
        localStorage.setItem('tokenExpiry', String(Date.now() + expiresIn));
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async refreshToken() {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await api.post('/auth/refresh', { refreshToken });
      
      if (response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        
        const expiresIn = response.data.expiresIn || 3600000;
        localStorage.setItem('tokenExpiry', String(Date.now() + expiresIn));
      }
      
      return response.data;
    } catch (error) {
      this.logout();
      throw error;
    }
  },

  async logout() {
    try {
      const token = this.getAccessToken();
      if (token) {
        await api.post('/auth/logout', {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('tokenExpiry');
    }
  },

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getAccessToken() {
    return localStorage.getItem('accessToken');
  },

  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  },

  isAuthenticated() {
    const token = this.getAccessToken();
    const expiry = localStorage.getItem('tokenExpiry');
    
    if (!token || !expiry) return false;
    
    // Token còn hạn
    return Date.now() < parseInt(expiry);
  },

  isTokenExpired() {
    const expiry = localStorage.getItem('tokenExpiry');
    if (!expiry) return true;
    return Date.now() > parseInt(expiry);
  }
};

export default authService;