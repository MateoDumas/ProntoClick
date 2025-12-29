import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Agregando campos de penalización...');

  try {
    // Agregar campo pendingPenalty a User
    await prisma.$executeRaw`
      ALTER TABLE "User" 
      ADD COLUMN IF NOT EXISTS "pendingPenalty" DOUBLE PRECISION DEFAULT 0;
    `;
    console.log('✅ Campo pendingPenalty agregado a User');

    // Agregar campo appliedPenalty a Order
    await prisma.$executeRaw`
      ALTER TABLE "Order" 
      ADD COLUMN IF NOT EXISTS "appliedPenalty" DOUBLE PRECISION;
    `;
    console.log('✅ Campo appliedPenalty agregado a Order');

    console.log('✅ Migración completada exitosamente');
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

