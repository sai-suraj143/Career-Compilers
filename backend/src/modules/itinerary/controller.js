const asyncHandler = require('../../middlewares/asyncHandler');
const sendResponse = require('../../utils/response');
const service = require('./service');

const create = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  if (payload.arrivalDate) payload.arrivalDate = new Date(payload.arrivalDate);
  if (payload.departureDate) payload.departureDate = new Date(payload.departureDate);
  const data = await service.create(payload);
  sendResponse(res, 201, 'Stop created successfully', data);
});

const update = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  if (payload.arrivalDate) payload.arrivalDate = new Date(payload.arrivalDate);
  if (payload.departureDate) payload.departureDate = new Date(payload.departureDate);
  const data = await service.update(req.params.id, payload);
  sendResponse(res, 200, 'Stop updated successfully', data);
});

const remove = asyncHandler(async (req, res) => {
  await service.remove(req.params.id);
  sendResponse(res, 200, 'Stop deleted successfully');
});

const reorder = asyncHandler(async (req, res) => {
  const data = await service.reorder(req.body.stops);
  sendResponse(res, 200, 'Stops reordered successfully', data);
});

module.exports = { create, update, remove, reorder };
