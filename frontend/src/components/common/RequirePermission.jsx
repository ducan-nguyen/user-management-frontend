// components/common/RequirePermission.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const RequirePermission = ({ children, permission, permissions = [], fallback = null }) => {
  const { hasPermission, hasAnyPermission } = useAuth();

  let hasAccess = false;

  if (permission) {
    hasAccess = hasPermission(permission);
  } else if (permissions.length > 0) {
    hasAccess = hasAnyPermission(...permissions);
  }

  if (!hasAccess) {
    toast.error("You don't have permission to access this resource");
    if (fallback) return fallback;
    return <Navigate to="/users" replace />;
  }

  return children;
};

export default RequirePermission;