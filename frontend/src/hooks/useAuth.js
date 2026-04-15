import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; // Import đúng cách

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  
  const { user, login, logout, loading, isAuthenticated, permissions, hasPermission, hasAnyPermission } = context;
  
  const role = user?.role;
  const isAdmin = role === 'ROLE_ADMIN';
  const isManager = role === 'ROLE_MANAGER';
  const isUser = role === 'ROLE_USER';
  const canEdit = isAdmin || isManager;
  const canDelete = isAdmin;
  const canCreate = isAdmin || isManager;
  const canToggleStatus = isAdmin || isManager;
  
  return {
    user,
    login,
    logout,
    loading,
    isAuthenticated,
    permissions,
    hasPermission,
    hasAnyPermission,
    role,
    isAdmin,
    isManager,
    isUser,
    canEdit,
    canDelete,
    canCreate,
    canToggleStatus
  };
};