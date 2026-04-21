const validateRegister = (payload = {}) => {
  const { username, email, password } = payload;
  if (!username || !email || !password) return "username, email and password are required";
  if (String(password).length < 8) return "password must be at least 8 characters";
  return null;
};

const validateLogin = (payload = {}) => {
  const { email, password } = payload;
  if (!email || !password) return "email and password are required";
  return null;
};

module.exports = { validateRegister, validateLogin };
