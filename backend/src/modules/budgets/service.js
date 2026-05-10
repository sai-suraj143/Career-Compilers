const repo = require('./repository');

const getSummary = async (userId) => repo.getSummary(userId);
const getByTripId = async (tripId) => repo.findByTripId(tripId);

const update = async (tripId, data) => {
  const totalCost = (data.transportCost || 0) + (data.stayCost || 0) + (data.foodCost || 0) + (data.activityCost || 0);
  return repo.updateByTripId(tripId, { ...data, totalCost });
};

const recalculate = async (tripId) => {
  // Logic to auto sum activity costs and update budget
  return true;
};

module.exports = { getSummary, getByTripId, update, recalculate };
