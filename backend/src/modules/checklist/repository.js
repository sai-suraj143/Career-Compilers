const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const create = async (data) => prisma.checklistItem.create({ data });
const update = async (id, data) => prisma.checklistItem.update({ where: { id }, data });
const remove = async (id) => prisma.checklistItem.delete({ where: { id } });

module.exports = { create, update, remove };
