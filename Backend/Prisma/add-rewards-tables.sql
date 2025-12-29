-- Agregar columna points a User si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'User' AND column_name = 'points') THEN
        ALTER TABLE "User" ADD COLUMN "points" INTEGER NOT NULL DEFAULT 0;
    END IF;
END $$;

-- Crear tabla Reward si no existe
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

-- Crear índice único para couponCode si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'Reward_couponCode_key') THEN
        CREATE UNIQUE INDEX "Reward_couponCode_key" ON "Reward"("couponCode");
    END IF;
END $$;

-- Crear índices para Reward
CREATE INDEX IF NOT EXISTS "Reward_isActive_idx" ON "Reward"("isActive");
CREATE INDEX IF NOT EXISTS "Reward_pointsCost_idx" ON "Reward"("pointsCost");

-- Crear tabla UserReward si no existe
CREATE TABLE IF NOT EXISTS "UserReward" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rewardId" TEXT NOT NULL,
    "couponCode" TEXT,
    "usedAt" TIMESTAMP(3),
    "redeemedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserReward_pkey" PRIMARY KEY ("id")
);

-- Crear índices para UserReward
CREATE INDEX IF NOT EXISTS "UserReward_userId_idx" ON "UserReward"("userId");
CREATE INDEX IF NOT EXISTS "UserReward_rewardId_idx" ON "UserReward"("rewardId");
CREATE INDEX IF NOT EXISTS "UserReward_couponCode_idx" ON "UserReward"("couponCode");

-- Crear tabla PointTransaction si no existe
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

-- Crear índices para PointTransaction
CREATE INDEX IF NOT EXISTS "PointTransaction_userId_idx" ON "PointTransaction"("userId");
CREATE INDEX IF NOT EXISTS "PointTransaction_orderId_idx" ON "PointTransaction"("orderId");
CREATE INDEX IF NOT EXISTS "PointTransaction_createdAt_idx" ON "PointTransaction"("createdAt");

-- Agregar foreign keys si no existen
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

