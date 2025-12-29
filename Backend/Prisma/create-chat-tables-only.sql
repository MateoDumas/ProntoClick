-- Script para crear SOLO las tablas de chat
-- Ignora errores si ya existen

-- Crear tabla ChatSession (si no existe)
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
        
        CREATE INDEX "ChatSession_userId_idx" ON "ChatSession"("userId");
        CREATE INDEX "ChatSession_status_idx" ON "ChatSession"("status");
        CREATE INDEX "ChatSession_createdAt_idx" ON "ChatSession"("createdAt");
        
        ALTER TABLE "ChatSession" 
        ADD CONSTRAINT "ChatSession_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
        
        RAISE NOTICE 'Tabla ChatSession creada';
    ELSE
        RAISE NOTICE 'Tabla ChatSession ya existe';
    END IF;
END $$;

-- Crear tabla ChatMessage (si no existe)
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
        
        CREATE INDEX "ChatMessage_sessionId_idx" ON "ChatMessage"("sessionId");
        CREATE INDEX "ChatMessage_createdAt_idx" ON "ChatMessage"("createdAt");
        
        ALTER TABLE "ChatMessage" 
        ADD CONSTRAINT "ChatMessage_sessionId_fkey" 
        FOREIGN KEY ("sessionId") REFERENCES "ChatSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
        
        RAISE NOTICE 'Tabla ChatMessage creada';
    ELSE
        RAISE NOTICE 'Tabla ChatMessage ya existe';
    END IF;
END $$;

