const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const findById = async (id) => prisma.user.findUnique({ where: { id } });
const update = async (id, data) => prisma.user.update({ where: { id }, data });

module.exports = { findById, update };
