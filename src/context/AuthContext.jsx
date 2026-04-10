import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/auth.service';

// Tạo context
export const AuthContext = createContext(); // THÊM export ở đây

// Custom hook để sử dụng auth context
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
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = authService.getCurrentUser();
        
        if (currentUser && authService.isAuthenticated()) {
          setUser(currentUser);
          setPermissions(getPermissionsByRole(currentUser.role));
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    initAuth();
  }, []);

  const getPermissionsByRole = (role) => {
    const permissionsMap = {
      'ROLE_ADMIN': [
        'USER_READ', 'USER_CREATE', 'USER_UPDATE', 'USER_DELETE', 
        'USER_STATUS_TOGGLE', 'ROLE_ASSIGN', 'USER_EXPORT'
      ],
      'ROLE_MANAGER': [
        'USER_READ', 'USER_CREATE', 'USER_UPDATE', 'USER_STATUS_TOGGLE'
      ],
      'ROLE_USER': ['USER_READ']
    };
    return permissionsMap[role] || [];
  };

  const login = async (username, password) => {
    const userData = await authService.login(username, password);
    setUser(userData);
    setPermissions(getPermissionsByRole(userData.role));
    return userData;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setPermissions([]);
  };

  const isAuthenticated = () => {
    return authService.isAuthenticated();
  };

  const hasPermission = (permission) => {
    return permissions.includes(permission);
  };

  const hasAnyPermission = (...perms) => {
    return perms.some(permission => permissions.includes(permission));
  };

  const value = {
    user,
    login,
    logout,
    loading,
    permissions,
    isAuthenticated,
    hasPermission,
    hasAnyPermission,
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