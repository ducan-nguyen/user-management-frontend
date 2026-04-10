import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import LoadingSpinner from "./LoadingSpinner";
import { toast } from "react-toastify";

const PrivateRoute = ({ 
  children, 
  roles = [],           // Danh sách role được phép
  permissions = [],     // Danh sách permission được phép
  requiredUserRole = null,
  redirectTo = "/login" 
}) => {
  const { isAuthenticated, user, loading, hasPermission, hasAnyPermission } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  // Kiểm tra đã đăng nhập chưa
  if (!isAuthenticated()) {
    toast.info("Please login to access this page");
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Lấy pathname hiện tại
  const pathname = location.pathname;

  // ==================== SPECIAL ROUTE HANDLERS ====================

  // 1. Trang tạo user mới - Admin và Manager đều được phép
  if (pathname === "/users/new") {
    if (user?.role === "ROLE_ADMIN" || user?.role === "ROLE_MANAGER") {
      return children;
    } else {
      toast.error("You don't have permission to create users");
      return <Navigate to="/users" replace />;
    }
  }

  // 2. Trang edit user - Admin và Manager đều được phép vào
  if (pathname.startsWith("/users/edit/")) {
    if (user?.role === "ROLE_ADMIN" || user?.role === "ROLE_MANAGER") {
      return children; // Quyền edit chi tiết sẽ kiểm tra trong UserForm
    } else {
      toast.error("You don't have permission to edit users");
      return <Navigate to="/users" replace />;
    }
  }

  // 3. Trang xem danh sách users - Admin và Manager
  if (pathname === "/users") {
    if (user?.role === "ROLE_ADMIN" || user?.role === "ROLE_MANAGER") {
      return children;
    } else {
      toast.error("You don't have permission to view users");
      return <Navigate to="/" replace />;
    }
  }

  // 4. Admin dashboard - Chỉ Admin
  if (pathname.startsWith("/admin")) {
    if (user?.role === "ROLE_ADMIN") {
      return children;
    } else {
      toast.error("Admin access required");
      return <Navigate to="/" replace />;
    }
  }

  // 5. Profile page - Tất cả user đã đăng nhập đều được
  if (pathname === "/profile") {
    return children;
  }

  // ==================== PERMISSION CHECK (nâng cao) ====================
  
  // Kiểm tra permissions (nếu có yêu cầu)
  if (permissions.length > 0) {
    if (!hasAnyPermission || !hasAnyPermission(...permissions)) {
      toast.error(`Access denied. Required permissions: ${permissions.join(', ')}`);
      return <Navigate to="/" replace />;
    }
  }

  // ==================== ROLE CHECK ====================
  
  // Kiểm tra roles (nếu có yêu cầu)
  if (roles.length > 0 && !roles.includes(user?.role)) {
    toast.error(`Access denied. Required roles: ${roles.join(', ')}`);
    return <Navigate to="/" replace />;
  }

  // ==================== REQUIRED USER ROLE CHECK ====================
  
  // Kiểm tra requiredUserRole (cho trường hợp edit user)
  if (requiredUserRole && user?.role === "ROLE_MANAGER") {
    // Manager chỉ được edit user có role ROLE_USER
    if (requiredUserRole !== "ROLE_USER") {
      toast.error("Managers can only edit regular users");
      return <Navigate to="/users" replace />;
    }
  }

  return children;
};

export default PrivateRoute;