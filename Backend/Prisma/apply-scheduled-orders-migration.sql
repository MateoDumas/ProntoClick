-- Migración para agregar campos de pedidos programados
-- Ejecutar este script directamente en la base de datos PostgreSQL

-- Agregar columnas a la tabla Order
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "isScheduled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "scheduledFor" TIMESTAMP(3);
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "scheduledOrderData" JSONB;

-- Crear índices
CREATE INDEX IF NOT EXISTS "Order_isScheduled_idx" ON "Order"("isScheduled");
CREATE INDEX IF NOT EXISTS "Order_scheduledFor_idx" ON "Order"("scheduledFor");
CREATE INDEX IF NOT EXISTS "Order_status_isScheduled_idx" ON "Order"("status", "isScheduled");

