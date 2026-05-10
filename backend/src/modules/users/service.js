const repo = require('./repository');

const getById = async (id) => {
  const user = await repo.findById(id);
  if (!user) throw new Error('User not found');
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

const update = async (id, data) => {
  const user = await repo.update(id, data);
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

module.exports = { getById, update };
