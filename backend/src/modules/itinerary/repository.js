const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const create = async (data) => prisma.stop.create({ data });
const update = async (id, data) => prisma.stop.update({ where: { id }, data });
const remove = async (id) => prisma.stop.delete({ where: { id } });

module.exports = { create, update, remove };
