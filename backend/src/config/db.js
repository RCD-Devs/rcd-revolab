// Instancia única de PrismaClient para toda la app.
// Se importa donde se necesita acceder a la base de datos.
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;
