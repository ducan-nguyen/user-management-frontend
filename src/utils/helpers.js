export const formatDate = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('vi-VN');
};

export const formatDateTime = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleString('vi-VN');
};

export const getStatusColor = (status) => {
  const colors = {
    'ACTIVE': 'success',
    'INACTIVE': 'warning',
    'LOCKED': 'danger'
  };
  return colors[status] || 'secondary';
};

export const getRoleName = (role) => {
  return role ? role.replace('ROLE_', '') : '';
};