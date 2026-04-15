import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import userService from '../services/user.service';

export const useUsers = (initialFilters = {}) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 10
  });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getAll();
      setUsers(data);
      setPagination(prev => ({
        ...prev,
        totalItems: data.length,
        totalPages: Math.ceil(data.length / prev.pageSize)
      }));
    } catch (err) {
      setError(err.message);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const searchUsers = useCallback(async (keyword) => {
    setLoading(true);
    try {
      if (keyword.trim()) {
        const results = await userService.search(keyword);
        setUsers(results);
        setPagination(prev => ({
          ...prev,
          totalItems: results.length,
          totalPages: Math.ceil(results.length / prev.pageSize)
        }));
      } else {
        await fetchUsers();
      }
    } catch (err) {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  }, [fetchUsers]);

  const addUser = useCallback(async (userData) => {
    try {
      const newUser = await userService.create(userData);
      setUsers(prev => [...prev, newUser]);
      toast.success('User created successfully');
      await fetchUsers();
      return newUser;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create user');
      throw err;
    }
  }, [fetchUsers]);

  const updateUser = useCallback(async (id, userData) => {
    try {
      const updatedUser = await userService.update(id, userData);
      setUsers(prev => prev.map(u => u.id === id ? updatedUser : u));
      toast.success('User updated successfully');
      return updatedUser;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update user');
      throw err;
    }
  }, []);

  const deleteUser = useCallback(async (id) => {
    try {
      await userService.delete(id);
      setUsers(prev => prev.filter(u => u.id !== id));
      toast.success('User deleted successfully');
    } catch (err) {
      toast.error('Failed to delete user');
      throw err;
    }
  }, []);

  const updateUserStatus = useCallback(async (id, status) => {
    try {
      const updatedUser = await userService.updateStatus(id, status);
      setUsers(prev => prev.map(u => u.id === id ? updatedUser : u));
      toast.success(`User status updated to ${status}`);
      return updatedUser;
    } catch (err) {
      toast.error('Failed to update status');
      throw err;
    }
  }, []);

  const getPaginatedUsers = useCallback(() => {
    const start = (pagination.currentPage - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    return users.slice(start, end);
  }, [users, pagination.currentPage, pagination.pageSize]);

  const changePage = useCallback((page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  }, []);

  const changePageSize = useCallback((size) => {
    setPagination(prev => ({ 
      ...prev, 
      pageSize: size,
      currentPage: 1,
      totalPages: Math.ceil(users.length / size)
    }));
  }, [users.length]);

  return {
    users: getPaginatedUsers(),
    allUsers: users,
    loading,
    error,
    filters,
    setFilters,
    searchUsers,
    addUser,
    updateUser,
    deleteUser,
    updateUserStatus,
    refresh: fetchUsers,
    pagination: {
      ...pagination,
      changePage,
      changePageSize
    }
  };
};