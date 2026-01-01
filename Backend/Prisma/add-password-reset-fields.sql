-- Agregar campos para reset de contraseña a la tabla User
ALTER TABLE "User" 
ADD COLUMN IF NOT EXISTS "passwordResetCode" TEXT,
ADD COLUMN IF NOT EXISTS "passwordResetCodeExpires" TIMESTAMP;
