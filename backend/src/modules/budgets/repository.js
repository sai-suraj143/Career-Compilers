const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getSummary = async (userId) => {
  const budgets = await prisma.budget.findMany({
    where: { trip: { userId: Number(userId) } }
  });
  const totalBudget = budgets.reduce((acc, b) => acc + (b.transportCost || 0) + (b.stayCost || 0) + (b.foodCost || 0) + (b.activityCost || 0), 0);
  return { totalBudget };
};

const findByTripId = async (tripId) => prisma.budget.findUnique({ where: { tripId } });
const create = async (data) => prisma.budget.create({ data });
const updateByTripId = async (tripId, data) => prisma.budget.update({ where: { tripId }, data });

module.exports = { getSummary, findByTripId, create, updateByTripId };
