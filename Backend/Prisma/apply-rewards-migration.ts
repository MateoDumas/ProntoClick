import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Aplicando cambios para sistema de recompensas...\n');

  try {
    // Agregar columna points a User si no existe
    await prisma.$executeRaw`
      DO $$ 
      BEGIN
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                         WHERE table_name = 'User' AND column_name = 'points') THEN
              ALTER TABLE "User" ADD COLUMN "points" INTEGER NOT NULL DEFAULT 0;
          END IF;
      END $$;
    `;
    console.log('✅ Columna points agregada a User');

    // Crear tabla Reward
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Reward" (
          "id" TEXT NOT NULL,
          "title" TEXT NOT NULL,
          "description" TEXT NOT NULL,
          "pointsCost" INTEGER NOT NULL,
          "type" TEXT NOT NULL,
          "discount" DOUBLE PRECISION,
          "discountAmount" DOUBLE PRECISION,
          "couponCode" TEXT,
          "image" TEXT,
          "isActive" BOOLEAN NOT NULL DEFAULT true,
          "stock" INTEGER,
          "redeemedCount" INTEGER NOT NULL DEFAULT 0,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "Reward_pkey" PRIMARY KEY ("id")
      );
    `;
    console.log('✅ Tabla Reward creada');

    // Crear índice único para couponCode si no existe
    await prisma.$executeRaw`
      DO $$ 
      BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'Reward_couponCode_key') THEN
              CREATE UNIQUE INDEX "Reward_couponCode_key" ON "Reward"("couponCode");
          END IF;
      END $$;
    `;

    // Crear índices para Reward
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "Reward_isActive_idx" ON "Reward"("isActive");`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "Reward_pointsCost_idx" ON "Reward"("pointsCost");`;
    console.log('✅ Índices de Reward creados');

    // Crear tabla UserReward
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "UserReward" (
          "id" TEXT NOT NULL,
          "userId" TEXT NOT NULL,
          "rewardId" TEXT NOT NULL,
          "couponCode" TEXT,
          "usedAt" TIMESTAMP(3),
          "redeemedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "UserReward_pkey" PRIMARY KEY ("id")
      );
    `;
    console.log('✅ Tabla UserReward creada');

    // Crear índices para UserReward
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "UserReward_userId_idx" ON "UserReward"("userId");`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "UserReward_rewardId_idx" ON "UserReward"("rewardId");`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "UserReward_couponCode_idx" ON "UserReward"("couponCode");`;
    console.log('✅ Índices de UserReward creados');

    // Crear tabla PointTransaction
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "PointTransaction" (
          "id" TEXT NOT NULL,
          "userId" TEXT NOT NULL,
          "points" INTEGER NOT NULL,
          "type" TEXT NOT NULL,
          "description" TEXT NOT NULL,
          "orderId" TEXT,
          "rewardId" TEXT,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "PointTransaction_pkey" PRIMARY KEY ("id")
      );
    `;
    console.log('✅ Tabla PointTransaction creada');

    // Crear índices para PointTransaction
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "PointTransaction_userId_idx" ON "PointTransaction"("userId");`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "PointTransaction_orderId_idx" ON "PointTransaction"("orderId");`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "PointTransaction_createdAt_idx" ON "PointTransaction"("createdAt");`;
    console.log('✅ Índices de PointTransaction creados');

    // Agregar foreign keys si no existen
    await prisma.$executeRaw`
      DO $$ 
      BEGIN
          -- UserReward -> User
          IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'UserReward_userId_fkey') THEN
              ALTER TABLE "UserReward" ADD CONSTRAINT "UserReward_userId_fkey" 
              FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
          END IF;
          
          -- UserReward -> Reward
          IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'UserReward_rewardId_fkey') THEN
              ALTER TABLE "UserReward" ADD CONSTRAINT "UserReward_rewardId_fkey" 
              FOREIGN KEY ("rewardId") REFERENCES "Reward"("id") ON DELETE CASCADE ON UPDATE CASCADE;
          END IF;
          
          -- PointTransaction -> User
          IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'PointTransaction_userId_fkey') THEN
              ALTER TABLE "PointTransaction" ADD CONSTRAINT "PointTransaction_userId_fkey" 
              FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
          END IF;
      END $$;
    `;
    console.log('✅ Foreign keys agregadas');

    console.log('\n✨ Migración completada exitosamente!');
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Error fatal:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

