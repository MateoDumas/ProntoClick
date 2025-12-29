import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

const prisma = new PrismaClient();

const migrations = [
  // 1. Campos de referidos en User
  `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "referralCode" TEXT`,
  `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "referredBy" TEXT`,
  `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "referralsCount" INTEGER NOT NULL DEFAULT 0`,
  
  // 2. Tabla Referral
  `CREATE TABLE IF NOT EXISTS "Referral" (
    "id" TEXT NOT NULL,
    "referrerId" TEXT NOT NULL,
    "referredUserId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "rewardPoints" INTEGER NOT NULL DEFAULT 0,
    "completedAt" TIMESTAMP(3),
    "rewardedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Referral_pkey" PRIMARY KEY ("id")
  )`,
  
  // 3. Tabla SavedList
  `CREATE TABLE IF NOT EXISTS "SavedList" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "items" JSONB NOT NULL,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "SavedList_pkey" PRIMARY KEY ("id")
  )`,
  
  // 4. Campo tipAmount en Order
  `ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "tipAmount" DOUBLE PRECISION`,
];

async function applyMigrations() {
  console.log('🔄 Aplicando migraciones...\n');

  try {
    for (let i = 0; i < migrations.length; i++) {
      const migration = migrations[i];
      try {
        await prisma.$executeRawUnsafe(migration);
        console.log(`✅ Migración ${i + 1}/${migrations.length} aplicada`);
      } catch (error: any) {
        // Ignorar errores de "ya existe"
        if (error.message.includes('already exists') || 
            error.message.includes('duplicate') ||
            error.message.includes('ya existe')) {
          console.log(`⚠️  Migración ${i + 1}/${migrations.length} ya aplicada (ignorando)`);
        } else {
          console.warn(`⚠️  Advertencia en migración ${i + 1}:`, error.message);
        }
      }
    }

    // Crear índices
    const indexes = [
      `CREATE UNIQUE INDEX IF NOT EXISTS "User_referralCode_key" ON "User"("referralCode") WHERE "referralCode" IS NOT NULL`,
      `CREATE INDEX IF NOT EXISTS "User_referredBy_idx" ON "User"("referredBy")`,
      `CREATE UNIQUE INDEX IF NOT EXISTS "Referral_referredUserId_key" ON "Referral"("referredUserId")`,
      `CREATE INDEX IF NOT EXISTS "Referral_referrerId_idx" ON "Referral"("referrerId")`,
      `CREATE INDEX IF NOT EXISTS "Referral_status_idx" ON "Referral"("status")`,
      `CREATE INDEX IF NOT EXISTS "SavedList_userId_idx" ON "SavedList"("userId")`,
      `CREATE INDEX IF NOT EXISTS "SavedList_isFavorite_idx" ON "SavedList"("isFavorite")`,
    ];

    for (const index of indexes) {
      try {
        await prisma.$executeRawUnsafe(index);
      } catch (error: any) {
        // Ignorar errores de índices duplicados
      }
    }

    // Agregar foreign keys (usando consultas separadas)
    const fkQueries = [
      `ALTER TABLE "User" DROP CONSTRAINT IF EXISTS "User_referredBy_fkey"`,
      `ALTER TABLE "User" ADD CONSTRAINT "User_referredBy_fkey" FOREIGN KEY ("referredBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
      `ALTER TABLE "Referral" DROP CONSTRAINT IF EXISTS "Referral_referrerId_fkey"`,
      `ALTER TABLE "Referral" ADD CONSTRAINT "Referral_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
      `ALTER TABLE "Referral" DROP CONSTRAINT IF EXISTS "Referral_referredUserId_fkey"`,
      `ALTER TABLE "Referral" ADD CONSTRAINT "Referral_referredUserId_fkey" FOREIGN KEY ("referredUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
      `ALTER TABLE "SavedList" DROP CONSTRAINT IF EXISTS "SavedList_userId_fkey"`,
      `ALTER TABLE "SavedList" ADD CONSTRAINT "SavedList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    ];

    for (const fk of fkQueries) {
      try {
        await prisma.$executeRawUnsafe(fk);
      } catch (error: any) {
        // Ignorar errores de constraints duplicados
        if (!error.message.includes('already exists')) {
          console.warn('⚠️  Advertencia FK:', error.message);
        }
      }
    }

    console.log('\n✨ Migraciones aplicadas correctamente!');
    console.log('📦 Regenerando Prisma Client...\n');
    
    // Regenerar Prisma Client
    execSync('npx prisma generate', { 
      cwd: path.join(__dirname, '..'), 
      stdio: 'inherit' 
    });
    
    console.log('\n✅ ¡Todo listo! Reinicia el backend.');
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

applyMigrations();

