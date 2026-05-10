const asyncHandler = require('../../middlewares/asyncHandler');
const sendResponse = require('../../utils/response');
const authService = require('./service');

const signup = asyncHandler(async (req, res) => {
  const user = await authService.signup(req.body);
  sendResponse(res, 201, 'User created successfully', user);
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  sendResponse(res, 200, 'Login successful', result);
});

const forgotPassword = asyncHandler(async (req, res) => {
  sendResponse(res, 200, 'Password reset link sent to email', {});
});

const logout = asyncHandler(async (req, res) => {
  sendResponse(res, 200, 'Logout successful', {});
});

module.exports = { signup, login, forgotPassword, logout };
