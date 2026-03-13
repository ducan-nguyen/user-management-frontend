// hooks/useAuth.js
import { useAuth as useAuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const auth = useAuthContext();
  
  // Thêm các helper methods nếu cần
  const hasRole = (role) => {
    return auth.user?.role === role;
  };
  
  const hasAnyRole = (roles) => {
    return roles.includes(auth.user?.role);
  };
  
  return {
    ...auth,
    hasRole,
    hasAnyRole,
    isAdmin: auth.user?.role === 'ROLE_ADMIN',
    isManager: auth.user?.role === 'ROLE_MANAGER',
    isUser: auth.user?.role === 'ROLE_USER'
  };
};