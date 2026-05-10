const repo = require('./repository');

const create = async (data) => repo.create(data);
const update = async (id, data) => repo.update(id, data);
const remove = async (id) => repo.remove(id);
const reorder = async (stops) => {
  const promises = stops.map(stop => repo.update(stop.id, { orderIndex: stop.orderIndex }));
  return Promise.all(promises);
};

module.exports = { create, update, remove, reorder };
