const asyncHandler = require('../../middlewares/asyncHandler');
const sendResponse = require('../../utils/response');
const service = require('./service');

const getRecent = asyncHandler(async (req, res) => {
  const data = await service.getRecent(req.params.userId);
  sendResponse(res, 200, 'Recent checklist fetched successfully', data);
});

const getByTripId = asyncHandler(async (req, res) => {
  const data = await service.getByTripId(req.params.tripId);
  sendResponse(res, 200, 'Checklist items fetched successfully', data);
});

const create = asyncHandler(async (req, res) => {
  const { tripId, userId, title, category, packed } = req.body;
  
  if (!tripId || !userId || !title) {
    const error = new Error('Missing required fields: tripId, userId, or title');
    error.statusCode = 400;
    throw error;
  }

  const payload = {
    tripId,
    userId: Number(userId),
    title,
    category: category || null,
    packed: packed === true || packed === 'true',
  };

  const data = await service.create(payload);
  sendResponse(res, 201, 'Checklist item created successfully', data);
});

const update = asyncHandler(async (req, res) => {
  const { title, category, packed } = req.body;
  const payload = {};
  if (title !== undefined) payload.title = title;
  if (category !== undefined) payload.category = category;
  if (packed !== undefined) payload.packed = packed === true || packed === 'true';

  const data = await service.update(req.params.id, payload);
  sendResponse(res, 200, 'Item updated successfully', data);
});

const remove = asyncHandler(async (req, res) => {
  await service.remove(req.params.id);
  sendResponse(res, 200, 'Item deleted successfully');
});

module.exports = { getRecent, getByTripId, create, update, remove };
