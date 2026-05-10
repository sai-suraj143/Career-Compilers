const asyncHandler = require('../../middlewares/asyncHandler');
const sendResponse = require('../../utils/response');

const getLink = asyncHandler(async (req, res) => {
  sendResponse(res, 200, 'Public link generated', { link: `https://traveloop.com/share/${req.params.tripId}` });
});

const copyTrip = asyncHandler(async (req, res) => {
  sendResponse(res, 201, 'Trip copied successfully', { newTripId: 'mock-new-id' });
});

module.exports = { getLink, copyTrip };
