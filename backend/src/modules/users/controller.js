const asyncHandler = require('../../middlewares/asyncHandler');
const sendResponse = require('../../utils/response');
const service = require('./service');

const getProfile = asyncHandler(async (req, res) => {
  const user = await service.getById(Number(req.params.id));
  sendResponse(res, 200, 'Profile fetched successfully', user);
});

const updateProfile = asyncHandler(async (req, res) => {
  const user = await service.update(Number(req.params.id), req.body);
  sendResponse(res, 200, 'Profile updated successfully', user);
});

module.exports = { getProfile, updateProfile };
