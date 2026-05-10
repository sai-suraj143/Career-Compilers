const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const findAll = async () => prisma.trip.findMany();
const findById = async (id) => prisma.trip.findUnique({ where: { id }, include: { stops: true, budget: true } });
const create = async (data) => prisma.trip.create({ data });
const update = async (id, data) => prisma.trip.update({ where: { id }, data });
const remove = async (id) => prisma.trip.delete({ where: { id } });

module.exports = { findAll, findById, create, update, remove };
