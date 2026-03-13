import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import LoadingSpinner from "./LoadingSpinner";
import { toast } from "react-toastify";

const PrivateRoute = ({ children, roles = [], requiredUserRole = null }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Cho phép Manager vào trang tạo user mới
  if (location.pathname === "/users/new") {
    if (user?.role === "ROLE_ADMIN" || user?.role === "ROLE_MANAGER") {
      return children; // Cho phép Admin và Manager vào trang tạo user
    } else {
      toast.error("You don't have permission to create users");
      return <Navigate to="/users" replace />;
    }
  }

  // Cho phép Manager vào trang edit user (sẽ kiểm tra thêm ở UserForm)
  if (location.pathname.startsWith("/users/edit/")) {
    if (user?.role === "ROLE_ADMIN" || user?.role === "ROLE_MANAGER") {
      return children; // Cho phép vào trang edit, sẽ kiểm tra quyền edit user nào ở UserForm
    } else {
      toast.error("You don't have permission to edit users");
      return <Navigate to="/users" replace />;
    }
  }

  // Kiểm tra role cơ bản cho các trang khác
  if (roles.length > 0 && !roles.includes(user?.role)) {
    toast.error("You don't have permission to access this page");
    return <Navigate to="/users" replace />;
  }

  return children;
};

export default PrivateRoute;
