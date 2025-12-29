-- Agregar campos de referidos al modelo User
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "referralCode" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "referredBy" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "referralsCount" INTEGER NOT NULL DEFAULT 0;

-- Crear índice único para referralCode (si no existe)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'User_referralCode_key') THEN
        CREATE UNIQUE INDEX "User_referralCode_key" ON "User"("referralCode");
    END IF;
END $$;

-- Crear índice para referredBy (si no existe)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'User_referredBy_idx') THEN
        CREATE INDEX "User_referredBy_idx" ON "User"("referredBy");
    END IF;
END $$;

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

-- Agregar foreign keys
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'User_referredBy_fkey') THEN
        ALTER TABLE "User" ADD CONSTRAINT "User_referredBy_fkey" 
            FOREIGN KEY ("referredBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Referral_referrerId_fkey') THEN
        ALTER TABLE "Referral" ADD CONSTRAINT "Referral_referrerId_fkey" 
            FOREIGN KEY ("referrerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- Crear tabla SavedList
CREATE TABLE IF NOT EXISTS "SavedList" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "items" JSONB NOT NULL,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "SavedList_pkey" PRIMARY KEY ("id")
);

-- Crear índices para SavedList
CREATE INDEX IF NOT EXISTS "SavedList_userId_idx" ON "SavedList"("userId");
CREATE INDEX IF NOT EXISTS "SavedList_isFavorite_idx" ON "SavedList"("isFavorite");

-- Agregar foreign key para SavedList
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'SavedList_userId_fkey') THEN
        ALTER TABLE "SavedList" ADD CONSTRAINT "SavedList_userId_fkey" 
            FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- Agregar campo tipAmount a Order
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "tipAmount" DOUBLE PRECISION;

