const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const create = async (data) => prisma.note.create({ data });
const findByTrip = async (tripId) => prisma.note.findMany({ where: { tripId } });
const update = async (id, data) => prisma.note.update({ where: { id }, data });
const remove = async (id) => prisma.note.delete({ where: { id } });

module.exports = { create, findByTrip, update, remove };
