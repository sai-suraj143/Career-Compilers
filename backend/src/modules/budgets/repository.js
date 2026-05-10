const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const findByTripId = async (tripId) => prisma.budget.findUnique({ where: { tripId } });
const create = async (data) => prisma.budget.create({ data });
const updateByTripId = async (tripId, data) => prisma.budget.update({ where: { tripId }, data });

module.exports = { findByTripId, create, updateByTripId };
