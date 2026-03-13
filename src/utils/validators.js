export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateUsername = (username) => {
  return username && username.length >= 3;
};

export const validatePhone = (phone) => {
  const re = /^[0-9]{10,11}$/;
  return !phone || re.test(phone);
};