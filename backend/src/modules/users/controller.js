const asyncHandler = require('../../middlewares/asyncHandler');
const sendResponse = require('../../utils/response');

const getProfile = asyncHandler(async (req, res) => {
  sendResponse(res, 200, 'Profile fetched successfully', {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@traveloop.com',
  });
});

const updateProfile = asyncHandler(async (req, res) => {
  sendResponse(res, 200, 'Profile updated successfully', req.body);
});

module.exports = { getProfile, updateProfile };
