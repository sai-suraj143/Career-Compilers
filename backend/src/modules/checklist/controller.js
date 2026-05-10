const asyncHandler = require('../../middlewares/asyncHandler');
const sendResponse = require('../../utils/response');
const service = require('./service');

const create = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  if (payload.userId) payload.userId = Number(payload.userId);
  const data = await service.create(payload);
  sendResponse(res, 201, 'Checklist item created successfully', data);
});

const update = asyncHandler(async (req, res) => {
  const data = await service.update(req.params.id, req.body);
  sendResponse(res, 200, 'Item updated successfully', data);
});

const remove = asyncHandler(async (req, res) => {
  await service.remove(req.params.id);
  sendResponse(res, 200, 'Item deleted successfully');
});

module.exports = { create, update, remove };
