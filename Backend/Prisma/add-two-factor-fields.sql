-- Agregar campos de 2FA a la tabla User
-- Ejecutar este script en Supabase SQL Editor

ALTER TABLE "User" 
ADD COLUMN IF NOT EXISTS "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS "twoFactorSecret" TEXT,
ADD COLUMN IF NOT EXISTS "twoFactorBackupCodes" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Verificar que los campos se agregaron correctamente
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'User' 
  AND column_name IN ('twoFactorEnabled', 'twoFactorSecret', 'twoFactorBackupCodes');

