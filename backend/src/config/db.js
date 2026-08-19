// Instancia única de PrismaClient para toda la app.
// Se importa donde se necesita acceder a la base de datos.
//
// Se cachea en globalThis porque este módulo corre dentro del proceso de
// Next.js: sin esto, cada hot-reload del dev server volvería a instanciar
// PrismaClient y agotaría el pool de conexiones de Supabase.
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

const prisma = globalForPrisma.__revolabPrisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.__revolabPrisma = prisma;
}

export default prisma;
