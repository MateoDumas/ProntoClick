-- Agregar tabla SavedList para listas personalizadas
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

-- Crear índices
CREATE INDEX IF NOT EXISTS "SavedList_userId_idx" ON "SavedList"("userId");
CREATE INDEX IF NOT EXISTS "SavedList_isFavorite_idx" ON "SavedList"("isFavorite");

-- Agregar foreign key
ALTER TABLE "SavedList" ADD CONSTRAINT IF NOT EXISTS "SavedList_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

