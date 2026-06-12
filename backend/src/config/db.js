// Instancia única de PrismaClient para toda la app.
// Se importa donde se necesite acceder a la base de datos.
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = prisma;
