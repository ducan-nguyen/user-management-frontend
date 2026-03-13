export const ROLES = {
  ADMIN: 'ROLE_ADMIN',
  MANAGER: 'ROLE_MANAGER',
  USER: 'ROLE_USER'
};

export const STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  LOCKED: 'LOCKED'
};

export const API_BASE_URL = 'http://localhost:8080/api';

export const PAGINATION = {
  PAGE_SIZE: 10,
  PAGE_SIZES: [5, 10, 20, 50]
};

export const TOAST_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  LOGIN_FAILED: 'Invalid username or password',
  REGISTER_SUCCESS: 'Registration successful! Please login.',
  REGISTER_FAILED: 'Registration failed',
  CREATE_SUCCESS: 'User created successfully',
  UPDATE_SUCCESS: 'User updated successfully',
  DELETE_SUCCESS: 'User deleted successfully',
  DELETE_CONFIRM: 'Are you sure you want to delete this user?'
};