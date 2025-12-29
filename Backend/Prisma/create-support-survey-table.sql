-- Script para crear la tabla SupportSurvey
-- Ejecutar este script en pgAdmin o en la consola de PostgreSQL
-- Este script también crea ChatSession y ChatMessage si no existen

-- ============================================
-- PASO 1: Crear tabla ChatSession (si no existe)
-- ============================================
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'ChatSession') THEN
        CREATE TABLE "ChatSession" (
            "id" TEXT NOT NULL,
            "userId" TEXT NOT NULL,
            "status" TEXT NOT NULL DEFAULT 'active',
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "ChatSession_pkey" PRIMARY KEY ("id")
        );
        
        CREATE INDEX IF NOT EXISTS "ChatSession_userId_idx" ON "ChatSession"("userId");
        CREATE INDEX IF NOT EXISTS "ChatSession_status_idx" ON "ChatSession"("status");
        CREATE INDEX IF NOT EXISTS "ChatSession_createdAt_idx" ON "ChatSession"("createdAt");
        
        -- Agregar foreign key a User si existe la tabla User
        IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'User') THEN
            ALTER TABLE "ChatSession" 
            ADD CONSTRAINT "ChatSession_userId_fkey" 
            FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
        END IF;
        
        RAISE NOTICE 'Tabla ChatSession creada';
    ELSE
        RAISE NOTICE 'Tabla ChatSession ya existe';
    END IF;
END $$;

-- ============================================
-- PASO 2: Crear tabla ChatMessage (si no existe)
-- ============================================
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'ChatMessage') THEN
        CREATE TABLE "ChatMessage" (
            "id" TEXT NOT NULL,
            "sessionId" TEXT NOT NULL,
            "role" TEXT NOT NULL,
            "content" TEXT NOT NULL,
            "metadata" JSONB,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
        );
        
        CREATE INDEX IF NOT EXISTS "ChatMessage_sessionId_idx" ON "ChatMessage"("sessionId");
        CREATE INDEX IF NOT EXISTS "ChatMessage_createdAt_idx" ON "ChatMessage"("createdAt");
        
        -- Agregar foreign key a ChatSession
        IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'ChatSession') THEN
            ALTER TABLE "ChatMessage" 
            ADD CONSTRAINT "ChatMessage_sessionId_fkey" 
            FOREIGN KEY ("sessionId") REFERENCES "ChatSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
        END IF;
        
        RAISE NOTICE 'Tabla ChatMessage creada';
    ELSE
        RAISE NOTICE 'Tabla ChatMessage ya existe';
    END IF;
END $$;

-- ============================================
-- PASO 3: Crear tabla SupportSurvey
-- ============================================
-- Crear la tabla SupportSurvey si no existe
CREATE TABLE IF NOT EXISTS "SupportSurvey" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "supportUserId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "SupportSurvey_pkey" PRIMARY KEY ("id")
);

-- Crear índice único en sessionId
CREATE UNIQUE INDEX IF NOT EXISTS "SupportSurvey_sessionId_key" ON "SupportSurvey"("sessionId");

-- Crear índices
CREATE INDEX IF NOT EXISTS "SupportSurvey_sessionId_idx" ON "SupportSurvey"("sessionId");
CREATE INDEX IF NOT EXISTS "SupportSurvey_supportUserId_idx" ON "SupportSurvey"("supportUserId");
CREATE INDEX IF NOT EXISTS "SupportSurvey_createdAt_idx" ON "SupportSurvey"("createdAt");
CREATE INDEX IF NOT EXISTS "SupportSurvey_rating_idx" ON "SupportSurvey"("rating");

-- Agregar foreign key a ChatSession
DO $$
BEGIN
    -- Verificar que ChatSession existe antes de agregar la foreign key
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'ChatSession') THEN
        IF NOT EXISTS (
            SELECT 1 FROM pg_constraint 
            WHERE conname = 'SupportSurvey_sessionId_fkey'
        ) THEN
            ALTER TABLE "SupportSurvey" 
            ADD CONSTRAINT "SupportSurvey_sessionId_fkey" 
            FOREIGN KEY ("sessionId") 
            REFERENCES "ChatSession"("id") 
            ON DELETE CASCADE 
            ON UPDATE CASCADE;
            
            RAISE NOTICE 'Foreign key SupportSurvey_sessionId_fkey agregada';
        ELSE
            RAISE NOTICE 'Foreign key SupportSurvey_sessionId_fkey ya existe';
        END IF;
    ELSE
        RAISE WARNING 'No se puede agregar foreign key: tabla ChatSession no existe';
    END IF;
END $$;

-- Agregar foreign key a User (supportUser)
DO $$
BEGIN
    -- Verificar que User existe antes de agregar la foreign key
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'User') THEN
        IF NOT EXISTS (
            SELECT 1 FROM pg_constraint 
            WHERE conname = 'SupportSurvey_supportUserId_fkey'
        ) THEN
            ALTER TABLE "SupportSurvey" 
            ADD CONSTRAINT "SupportSurvey_supportUserId_fkey" 
            FOREIGN KEY ("supportUserId") 
            REFERENCES "User"("id") 
            ON DELETE CASCADE 
            ON UPDATE CASCADE;
            
            RAISE NOTICE 'Foreign key SupportSurvey_supportUserId_fkey agregada';
        ELSE
            RAISE NOTICE 'Foreign key SupportSurvey_supportUserId_fkey ya existe';
        END IF;
    ELSE
        RAISE WARNING 'No se puede agregar foreign key: tabla User no existe';
    END IF;
END $$;

-- Agregar relación en ChatSession (campo survey)
-- Nota: Esto es solo para referencia, Prisma manejará la relación
-- No necesitamos agregar una columna física ya que es una relación 1:1

SELECT 'Tabla SupportSurvey creada exitosamente' AS resultado;

