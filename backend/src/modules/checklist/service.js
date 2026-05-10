const repo = require('./repository');

const getRecent = async (userId) => repo.getRecent(userId);
const getByTripId = async (tripId) => repo.getByTripId(tripId);
const create = async (data) => repo.create(data);
const update = async (id, data) => repo.update(id, data);
const remove = async (id) => repo.remove(id);

module.exports = { getRecent, getByTripId, create, update, remove };
