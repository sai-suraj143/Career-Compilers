const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const findByEmail = async (email) => prisma.user.findUnique({ where: { email } });
const create = async (data) => prisma.user.create({ data });

module.exports = { findByEmail, create };
