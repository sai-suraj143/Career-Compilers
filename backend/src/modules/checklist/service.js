const repo = require('./repository');

const create = async (data) => repo.create(data);
const update = async (id, data) => repo.update(id, data);
const remove = async (id) => repo.remove(id);

module.exports = { create, update, remove };
