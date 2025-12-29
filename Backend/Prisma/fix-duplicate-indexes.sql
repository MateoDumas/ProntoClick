-- Script para verificar y eliminar índices duplicados si es necesario
-- Ejecutar este script directamente en PostgreSQL si es necesario

-- Verificar índices existentes en Favorite
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'Favorite' 
AND indexname LIKE '%userId%';

-- Verificar índices existentes en User
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'User' 
AND indexname LIKE '%referralCode%';

-- Si necesitas eliminar índices duplicados (descomentar si es necesario):
-- DROP INDEX IF EXISTS "Favorite_userId_restaurantId_key";
-- DROP INDEX IF EXISTS "Favorite_userId_productId_key";
-- DROP INDEX IF EXISTS "User_referralCode_key";

