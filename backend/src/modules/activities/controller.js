const asyncHandler = require('../../middlewares/asyncHandler');
const sendResponse = require('../../utils/response');
const service = require('./service');

const create = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  if (payload.activityDate) payload.activityDate = new Date(payload.activityDate);
  const data = await service.create(payload);
  sendResponse(res, 201, 'Activity created successfully', data);
});

const update = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  if (payload.activityDate) payload.activityDate = new Date(payload.activityDate);
  const data = await service.update(req.params.id, payload);
  sendResponse(res, 200, 'Activity updated successfully', data);
});

const remove = asyncHandler(async (req, res) => {
  await service.remove(req.params.id);
  sendResponse(res, 200, 'Activity deleted successfully');
});

const search = asyncHandler(async (req, res) => {
  const data = await service.search(req.query.q);
  sendResponse(res, 200, 'Activities fetched successfully', data);
});

module.exports = { create, update, remove, search };
