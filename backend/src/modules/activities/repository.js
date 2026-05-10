const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const findById = async (id) => prisma.activity.findUnique({ where: { id } });
const create = async (data) => prisma.activity.create({ data });
const update = async (id, data) => prisma.activity.update({ where: { id }, data });
const remove = async (id) => prisma.activity.delete({ where: { id } });
const search = async (q) => prisma.activity.findMany({
  where: { title: { contains: q || '' } }
});

module.exports = { findById, create, update, remove, search };
