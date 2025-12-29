import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function safeDbPush() {
  try {
    console.log('🔍 Verificando estado de la base de datos...');

    // Verificar si las tablas principales existen
    const tables = await prisma.$queryRaw<Array<{ tablename: string }>>`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename IN ('Order', 'PushToken', 'Favorite', 'User')
      ORDER BY tablename
    `;

    console.log('📊 Tablas encontradas:', tables.map(t => t.tablename).join(', '));

    // Verificar índices en Favorite
    const favoriteIndexes = await prisma.$queryRaw<Array<{ indexname: string }>>`
      SELECT indexname 
      FROM pg_indexes 
      WHERE tablename = 'Favorite' 
      AND indexname LIKE '%userId%'
    `;

    console.log('📌 Índices en Favorite:', favoriteIndexes.map(i => i.indexname).join(', '));

    // Verificar si la tabla Order tiene los nuevos campos
    const orderColumns = await prisma.$queryRaw<Array<{ column_name: string }>>`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'Order' 
      AND column_name IN ('isScheduled', 'scheduledFor', 'scheduledOrderData')
    `;

    console.log('📋 Campos de pedidos programados en Order:', orderColumns.map(c => c.column_name).join(', '));

    // Verificar si la tabla PushToken existe
    const pushTokenExists = tables.some(t => t.tablename === 'PushToken');
    
    if (!pushTokenExists) {
      console.log('⚠️  La tabla PushToken no existe. Creándola...');
      
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "PushToken" (
          "id" TEXT NOT NULL,
          "userId" TEXT NOT NULL,
          "token" TEXT NOT NULL,
          "platform" TEXT NOT NULL,
          "deviceId" TEXT,
          "isActive" BOOLEAN NOT NULL DEFAULT true,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "PushToken_pkey" PRIMARY KEY ("id"),
          CONSTRAINT "PushToken_token_key" UNIQUE ("token")
        )
      `;

      await prisma.$executeRaw`
        CREATE INDEX IF NOT EXISTS "PushToken_userId_idx" ON "PushToken"("userId")
      `;

      await prisma.$executeRaw`
        CREATE INDEX IF NOT EXISTS "PushToken_token_idx" ON "PushToken"("token")
      `;

      await prisma.$executeRaw`
        CREATE INDEX IF NOT EXISTS "PushToken_isActive_idx" ON "PushToken"("isActive")
      `;

      await prisma.$executeRaw`
        ALTER TABLE "PushToken" ADD CONSTRAINT IF NOT EXISTS "PushToken_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
      `;

      console.log('✅ Tabla PushToken creada exitosamente');
    } else {
      console.log('✅ La tabla PushToken ya existe');
    }

    // Verificar campos de Order
    if (orderColumns.length < 3) {
      console.log('⚠️  Faltan campos en Order. Agregándolos...');
      
      const missingColumns = ['isScheduled', 'scheduledFor', 'scheduledOrderData'].filter(
        col => !orderColumns.some(c => c.column_name === col)
      );

      for (const col of missingColumns) {
        if (col === 'isScheduled') {
          await prisma.$executeRaw`
            ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "isScheduled" BOOLEAN NOT NULL DEFAULT false
          `;
        } else if (col === 'scheduledFor') {
          await prisma.$executeRaw`
            ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "scheduledFor" TIMESTAMP(3)
          `;
        } else if (col === 'scheduledOrderData') {
          await prisma.$executeRaw`
            ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "scheduledOrderData" JSONB
          `;
        }
        console.log(`✅ Columna ${col} agregada`);
      }

      // Crear índices si no existen
      await prisma.$executeRaw`
        CREATE INDEX IF NOT EXISTS "Order_isScheduled_idx" ON "Order"("isScheduled")
      `;

      await prisma.$executeRaw`
        CREATE INDEX IF NOT EXISTS "Order_scheduledFor_idx" ON "Order"("scheduledFor")
      `;

      await prisma.$executeRaw`
        CREATE INDEX IF NOT EXISTS "Order_status_isScheduled_idx" ON "Order"("status", "isScheduled")
      `;

      console.log('✅ Índices de Order creados');
    }

    console.log('✨ Verificación completada exitosamente!');
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

safeDbPush()
  .then(() => {
    console.log('🎉 Proceso finalizado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error fatal:', error);
    process.exit(1);
  });

