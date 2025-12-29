import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function applyMigration() {
  try {
    console.log('🔄 Aplicando migración de pedidos programados...');

    // Verificar si las columnas ya existen
    const checkQuery = await prisma.$queryRaw<Array<{ column_name: string }>>`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'Order' 
      AND column_name IN ('isScheduled', 'scheduledFor', 'scheduledOrderData')
    `;

    const existingColumns = checkQuery.map((row: any) => row.column_name);

    // Agregar columna isScheduled si no existe
    if (!existingColumns.includes('isScheduled')) {
      await prisma.$executeRaw`
        ALTER TABLE "Order" ADD COLUMN "isScheduled" BOOLEAN NOT NULL DEFAULT false
      `;
      console.log('✅ Columna isScheduled agregada');
    } else {
      console.log('⏭️  Columna isScheduled ya existe');
    }

    // Agregar columna scheduledFor si no existe
    if (!existingColumns.includes('scheduledFor')) {
      await prisma.$executeRaw`
        ALTER TABLE "Order" ADD COLUMN "scheduledFor" TIMESTAMP(3)
      `;
      console.log('✅ Columna scheduledFor agregada');
    } else {
      console.log('⏭️  Columna scheduledFor ya existe');
    }

    // Agregar columna scheduledOrderData si no existe
    if (!existingColumns.includes('scheduledOrderData')) {
      await prisma.$executeRaw`
        ALTER TABLE "Order" ADD COLUMN "scheduledOrderData" JSONB
      `;
      console.log('✅ Columna scheduledOrderData agregada');
    } else {
      console.log('⏭️  Columna scheduledOrderData ya existe');
    }

    // Verificar índices existentes
    const indexQuery = await prisma.$queryRaw<Array<{ indexname: string }>>`
      SELECT indexname 
      FROM pg_indexes 
      WHERE tablename = 'Order' 
      AND indexname IN (
        'Order_isScheduled_idx', 
        'Order_scheduledFor_idx', 
        'Order_status_isScheduled_idx'
      )
    `;

    const existingIndexes = indexQuery.map((row: any) => row.indexname);

    // Crear índices si no existen
    if (!existingIndexes.includes('Order_isScheduled_idx')) {
      await prisma.$executeRaw`
        CREATE INDEX IF NOT EXISTS "Order_isScheduled_idx" ON "Order"("isScheduled")
      `;
      console.log('✅ Índice Order_isScheduled_idx creado');
    } else {
      console.log('⏭️  Índice Order_isScheduled_idx ya existe');
    }

    if (!existingIndexes.includes('Order_scheduledFor_idx')) {
      await prisma.$executeRaw`
        CREATE INDEX IF NOT EXISTS "Order_scheduledFor_idx" ON "Order"("scheduledFor")
      `;
      console.log('✅ Índice Order_scheduledFor_idx creado');
    } else {
      console.log('⏭️  Índice Order_scheduledFor_idx ya existe');
    }

    if (!existingIndexes.includes('Order_status_isScheduled_idx')) {
      await prisma.$executeRaw`
        CREATE INDEX IF NOT EXISTS "Order_status_isScheduled_idx" ON "Order"("status", "isScheduled")
      `;
      console.log('✅ Índice Order_status_isScheduled_idx creado');
    } else {
      console.log('⏭️  Índice Order_status_isScheduled_idx ya existe');
    }

    console.log('✅ Migración completada exitosamente!');
  } catch (error) {
    console.error('❌ Error al aplicar migración:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

applyMigration()
  .then(() => {
    console.log('✨ Proceso finalizado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error fatal:', error);
    process.exit(1);
  });

