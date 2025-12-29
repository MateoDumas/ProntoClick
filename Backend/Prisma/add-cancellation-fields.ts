import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔧 Agregando campos de cancelación y tabla Report...');

  try {
    // Agregar campos de cancelación a Order
    await prisma.$executeRaw`
      ALTER TABLE "Order" 
      ADD COLUMN IF NOT EXISTS "cancellationReason" TEXT,
      ADD COLUMN IF NOT EXISTS "cancellationFee" DOUBLE PRECISION,
      ADD COLUMN IF NOT EXISTS "cancelledAt" TIMESTAMP(3);
    `;
    console.log('✅ Campos de cancelación agregados a Order');

    // Crear tabla Report
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Report" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "orderId" TEXT NOT NULL,
        "type" TEXT NOT NULL DEFAULT 'cancellation',
        "reason" TEXT NOT NULL,
        "fee" DOUBLE PRECISION,
        "status" TEXT NOT NULL DEFAULT 'pending',
        "notes" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
      );
    `;
    console.log('✅ Tabla Report creada');

    // Crear índices
    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS "Report_userId_idx" ON "Report"("userId");
    `;
    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS "Report_orderId_idx" ON "Report"("orderId");
    `;
    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS "Report_status_idx" ON "Report"("status");
    `;
    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS "Report_createdAt_idx" ON "Report"("createdAt");
    `;
    console.log('✅ Índices de Report creados');

    // Agregar foreign keys
    const fkUserIdExists = await prisma.$queryRaw<Array<{ count: bigint }>>`
      SELECT COUNT(*) as count
      FROM pg_constraint 
      WHERE conname = 'Report_userId_fkey';
    `;

    if (fkUserIdExists[0].count === BigInt(0)) {
      await prisma.$executeRaw`
        ALTER TABLE "Report" 
        ADD CONSTRAINT "Report_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
      `;
      console.log('✅ Foreign key Report_userId_fkey agregada');
    } else {
      console.log('ℹ️  Foreign key Report_userId_fkey ya existe');
    }

    const fkOrderIdExists = await prisma.$queryRaw<Array<{ count: bigint }>>`
      SELECT COUNT(*) as count
      FROM pg_constraint 
      WHERE conname = 'Report_orderId_fkey';
    `;

    if (fkOrderIdExists[0].count === BigInt(0)) {
      await prisma.$executeRaw`
        ALTER TABLE "Report" 
        ADD CONSTRAINT "Report_orderId_fkey" 
        FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
      `;
      console.log('✅ Foreign key Report_orderId_fkey agregada');
    } else {
      console.log('ℹ️  Foreign key Report_orderId_fkey ya existe');
    }

    console.log('\n🎉 ¡Migración completada exitosamente!');
  } catch (error) {
    console.error('❌ Error:', error);
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

