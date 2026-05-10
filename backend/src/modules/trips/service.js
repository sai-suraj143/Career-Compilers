const repo = require('./repository');
const budgetRepo = require('../budgets/repository');

const getAll = async () => repo.findAll();
const getById = async (id) => repo.findById(id);
const create = async (data) => {
  const trip = await repo.create(data);
  // Auto create empty budget
  await budgetRepo.create({ tripId: trip.id });
  return trip;
};
const update = async (id, data) => repo.update(id, data);
const remove = async (id) => repo.remove(id);

module.exports = { getAll, getById, create, update, remove };
