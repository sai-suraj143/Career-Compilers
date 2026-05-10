const asyncHandler = require('../../middlewares/asyncHandler');
const sendResponse = require('../../utils/response');
const service = require('./service');

const getAll = asyncHandler(async (req, res) => {
  const data = await service.getAll();
  sendResponse(res, 200, 'Trips fetched successfully', data);
});

const getById = asyncHandler(async (req, res) => {
  const data = await service.getById(req.params.id);
  sendResponse(res, 200, 'Trip fetched successfully', data);
});

const create = asyncHandler(async (req, res) => {
  const data = await service.create(req.body);
  sendResponse(res, 201, 'Trip created successfully', data);
});

const update = asyncHandler(async (req, res) => {
  const data = await service.update(req.params.id, req.body);
  sendResponse(res, 200, 'Trip updated successfully', data);
});

const remove = asyncHandler(async (req, res) => {
  await service.remove(req.params.id);
  sendResponse(res, 200, 'Trip deleted successfully');
});

module.exports = { getAll, getById, create, update, remove };
