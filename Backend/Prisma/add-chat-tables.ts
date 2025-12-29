import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Creando tablas de chat...');

  // Crear tabla ChatSession
  await prisma.$executeRaw`
    CREATE TABLE IF NOT EXISTS "ChatSession" (
      "id" TEXT NOT NULL,
      "userId" TEXT NOT NULL,
      "status" TEXT NOT NULL DEFAULT 'active',
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL,
      CONSTRAINT "ChatSession_pkey" PRIMARY KEY ("id")
    )
  `;

  // Crear tabla ChatMessage
  await prisma.$executeRaw`
    CREATE TABLE IF NOT EXISTS "ChatMessage" (
      "id" TEXT NOT NULL,
      "sessionId" TEXT NOT NULL,
      "role" TEXT NOT NULL,
      "content" TEXT NOT NULL,
      "metadata" JSONB,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
    )
  `;

  // Crear índices
  await prisma.$executeRaw`
    CREATE INDEX IF NOT EXISTS "ChatSession_userId_idx" ON "ChatSession"("userId")
  `;
  await prisma.$executeRaw`
    CREATE INDEX IF NOT EXISTS "ChatSession_status_idx" ON "ChatSession"("status")
  `;
  await prisma.$executeRaw`
    CREATE INDEX IF NOT EXISTS "ChatSession_createdAt_idx" ON "ChatSession"("createdAt")
  `;
  await prisma.$executeRaw`
    CREATE INDEX IF NOT EXISTS "ChatMessage_sessionId_idx" ON "ChatMessage"("sessionId")
  `;
  await prisma.$executeRaw`
    CREATE INDEX IF NOT EXISTS "ChatMessage_createdAt_idx" ON "ChatMessage"("createdAt")
  `;

  // Agregar foreign keys
  try {
    await prisma.$executeRaw`
      ALTER TABLE "ChatSession" 
      ADD CONSTRAINT "ChatSession_userId_fkey" 
      FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
    `;
  } catch (e: any) {
    if (!e.message.includes('already exists')) {
      console.log('⚠️ Foreign key ChatSession_userId_fkey ya existe o error:', e.message);
    }
  }

  try {
    await prisma.$executeRaw`
      ALTER TABLE "ChatMessage" 
      ADD CONSTRAINT "ChatMessage_sessionId_fkey" 
      FOREIGN KEY ("sessionId") REFERENCES "ChatSession"("id") ON DELETE CASCADE ON UPDATE CASCADE
    `;
  } catch (e: any) {
    if (!e.message.includes('already exists')) {
      console.log('⚠️ Foreign key ChatMessage_sessionId_fkey ya existe o error:', e.message);
    }
  }

  console.log('✅ Tablas de chat creadas exitosamente');
}

main()
  .catch((e) => {
    console.error('❌ Error al crear tablas:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

