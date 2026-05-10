const authRepository = require('./repository');
const bcrypt = require('bcrypt');

const signup = async (data) => {
  const existing = await authRepository.findByEmail(data.email);
  if (existing) {
    const error = new Error('Email already exists');
    error.statusCode = 400;
    throw error;
  }
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const user = await authRepository.create({ ...data, password: hashedPassword });
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

const login = async (data) => {
  const user = await authRepository.findByEmail(data.email);
  if (!user) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }
  const isValid = await bcrypt.compare(data.password, user.password);
  if (!isValid) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }
  const { password, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token: 'static-token-placeholder' };
};

module.exports = { signup, login };
