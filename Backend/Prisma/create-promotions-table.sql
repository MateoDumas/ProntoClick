-- Crear tabla Promotion
CREATE TABLE IF NOT EXISTS "Promotion" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "discount" DOUBLE PRECISION,
    "discountAmount" DOUBLE PRECISION,
    "minOrder" DOUBLE PRECISION,
    "code" TEXT,
    "type" TEXT NOT NULL,
    "image" TEXT,
    "restaurantId" TEXT,
    "category" TEXT,
    "dayOfWeek" INTEGER,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Promotion_pkey" PRIMARY KEY ("id")
);

-- Crear índices
CREATE INDEX IF NOT EXISTS "Promotion_isActive_idx" ON "Promotion"("isActive");
CREATE INDEX IF NOT EXISTS "Promotion_dayOfWeek_idx" ON "Promotion"("dayOfWeek");
CREATE INDEX IF NOT EXISTS "Promotion_restaurantId_idx" ON "Promotion"("restaurantId");

-- Agregar foreign key
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'Promotion_restaurantId_fkey'
    ) THEN
        ALTER TABLE "Promotion" 
        ADD CONSTRAINT "Promotion_restaurantId_fkey" 
        FOREIGN KEY ("restaurantId") 
        REFERENCES "Restaurant"("id") 
        ON DELETE CASCADE 
        ON UPDATE CASCADE;
    END IF;
END $$;

