-- Agregar campos de referidos al modelo User
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "referralCode" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "referredBy" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "referralsCount" INTEGER NOT NULL DEFAULT 0;

-- Crear índice único para referralCode
CREATE UNIQUE INDEX IF NOT EXISTS "User_referralCode_key" ON "User"("referralCode");

-- Crear índice para referredBy
CREATE INDEX IF NOT EXISTS "User_referredBy_idx" ON "User"("referredBy");

-- Crear tabla Referral
CREATE TABLE IF NOT EXISTS "Referral" (
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
);

-- Crear índices para Referral
CREATE UNIQUE INDEX IF NOT EXISTS "Referral_referredUserId_key" ON "Referral"("referredUserId");
CREATE INDEX IF NOT EXISTS "Referral_referrerId_idx" ON "Referral"("referrerId");
CREATE INDEX IF NOT EXISTS "Referral_referredUserId_idx" ON "Referral"("referredUserId");
CREATE INDEX IF NOT EXISTS "Referral_status_idx" ON "Referral"("status");

-- Agregar foreign key para referredBy
ALTER TABLE "User" ADD CONSTRAINT IF NOT EXISTS "User_referredBy_fkey" 
    FOREIGN KEY ("referredBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Agregar foreign key para Referral
ALTER TABLE "Referral" ADD CONSTRAINT IF NOT EXISTS "Referral_referrerId_fkey" 
    FOREIGN KEY ("referrerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

