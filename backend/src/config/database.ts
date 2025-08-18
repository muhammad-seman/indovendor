import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!(global as any).__prisma) {
    (global as any).__prisma = new PrismaClient();
  }
  prisma = (global as any).__prisma;
}

export default prisma;