const asyncHandler = require('../../middlewares/asyncHandler');
const sendResponse = require('../../utils/response');
const service = require('./service');

const get = asyncHandler(async (req, res) => {
  const data = await service.getByTripId(req.params.tripId);
  sendResponse(res, 200, 'Budget fetched successfully', data);
});

const update = asyncHandler(async (req, res) => {
  const data = await service.update(req.params.tripId, req.body);
  sendResponse(res, 200, 'Budget updated successfully', data);
});

module.exports = { get, update };
