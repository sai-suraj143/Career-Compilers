const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getRecent = async (userId) => {
  const latestTrip = await prisma.trip.findFirst({
    where: { userId: Number(userId) },
    orderBy: { createdAt: 'desc' },
  });
  if (!latestTrip) return null;
  const items = await prisma.checklistItem.findMany({
    where: { tripId: latestTrip.id },
  });
  return { trip: latestTrip, items };
};

const getByTripId = async (tripId) => prisma.checklistItem.findMany({ where: { tripId } });
const create = async (data) => prisma.checklistItem.create({ data });
const update = async (id, data) => prisma.checklistItem.update({ where: { id }, data });
const remove = async (id) => prisma.checklistItem.delete({ where: { id } });

module.exports = { getRecent, getByTripId, create, update, remove };
