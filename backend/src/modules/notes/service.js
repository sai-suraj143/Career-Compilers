const repo = require('./repository');

const create = async (data) => repo.create(data);
const getByTrip = async (tripId) => repo.findByTrip(tripId);
const update = async (id, data) => repo.update(id, data);
const remove = async (id) => repo.remove(id);

module.exports = { create, getByTrip, update, remove };
