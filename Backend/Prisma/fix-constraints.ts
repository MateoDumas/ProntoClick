import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔧 Corrigiendo constraints de Favorite...\n');

  try {
    // Eliminar constraints únicos existentes si existen
    await prisma.$executeRaw`
      ALTER TABLE "Favorite" DROP CONSTRAINT IF EXISTS "Favorite_userId_restaurantId_key";
    `;
    console.log('✅ Constraint userId_restaurantId eliminado');

    await prisma.$executeRaw`
      ALTER TABLE "Favorite" DROP CONSTRAINT IF EXISTS "Favorite_userId_productId_key";
    `;
    console.log('✅ Constraint userId_productId eliminado');

    // Recrear los constraints con los nombres explícitos
    await prisma.$executeRaw`
      ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_userId_restaurantId_key" UNIQUE ("userId", "restaurantId");
    `;
    console.log('✅ Constraint userId_restaurantId recreado');

    await prisma.$executeRaw`
      ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_userId_productId_key" UNIQUE ("userId", "productId");
    `;
    console.log('✅ Constraint userId_productId recreado');

    console.log('\n✨ Constraints corregidos exitosamente!');
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Error fatal:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

