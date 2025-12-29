-- Eliminar constraints únicos existentes si existen
ALTER TABLE "Favorite" DROP CONSTRAINT IF EXISTS "Favorite_userId_restaurantId_key";
ALTER TABLE "Favorite" DROP CONSTRAINT IF EXISTS "Favorite_userId_productId_key";

-- Recrear los constraints con los nombres explícitos
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_userId_restaurantId_key" UNIQUE ("userId", "restaurantId");
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_userId_productId_key" UNIQUE ("userId", "productId");

