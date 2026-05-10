const repo = require('./repository');
const budgetService = require('../budgets/service');

const create = async (data) => {
  const activity = await repo.create(data);
  if(data.tripId) await budgetService.recalculate(data.tripId);
  return activity;
};

const update = async (id, data) => {
  const activity = await repo.update(id, data);
  if(data.tripId) await budgetService.recalculate(data.tripId);
  return activity;
};

const remove = async (id) => {
  await repo.remove(id);
  return true;
};

const search = async (q) => repo.search(q);

module.exports = { create, update, remove, search };
