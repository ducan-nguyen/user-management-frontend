import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/auth.service';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = authService.getCurrentUser();
        
        if (currentUser && authService.isAuthenticated()) {
          setUser(currentUser);
        } else if (currentUser && authService.isTokenExpired()) {
          try {
            await authService.refreshToken();
            setUser(authService.getCurrentUser());
          } catch (error) {
            console.log('Auto refresh failed, please login again');
            authService.logout();
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    initAuth();
  }, []);

  const login = async (username, password) => {
    const userData = await authService.login(username, password);
    setUser(userData);
    return userData;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: () => authService.isAuthenticated(),
    isAdmin: user?.role === 'ROLE_ADMIN',
    isManager: user?.role === 'ROLE_MANAGER',
    isUser: user?.role === 'ROLE_USER'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};