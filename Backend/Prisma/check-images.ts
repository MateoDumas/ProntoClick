import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkImages() {
  console.log('🔍 Verificando imágenes en la base de datos...\n');

  // Verificar restaurantes
  const restaurants = await prisma.restaurant.findMany({
    select: {
      id: true,
      name: true,
      image: true,
    },
  });

  console.log(`📊 Total restaurantes: ${restaurants.length}`);
  const restaurantsWithoutImage = restaurants.filter((r) => !r.image || r.image.trim() === '');
  console.log(`❌ Restaurantes sin imagen: ${restaurantsWithoutImage.length}`);
  if (restaurantsWithoutImage.length > 0) {
    restaurantsWithoutImage.forEach((r) => {
      console.log(`   - ${r.name} (ID: ${r.id})`);
    });
  }

  // Verificar productos
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      image: true,
      restaurantId: true,
    },
    take: 20, // Solo los primeros 20 para no saturar
  });

  console.log(`\n📊 Total productos (muestra de 20): ${products.length}`);
  const productsWithoutImage = products.filter((p) => !p.image || p.image.trim() === '');
  console.log(`❌ Productos sin imagen: ${productsWithoutImage.length}`);
  if (productsWithoutImage.length > 0) {
    productsWithoutImage.forEach((p) => {
      console.log(`   - ${p.name} (ID: ${p.id}, Restaurant: ${p.restaurantId})`);
    });
  }

  // Mostrar algunos productos con imagen para verificar
  console.log(`\n✅ Productos con imagen (ejemplos):`);
  const productsWithImage = products.filter((p) => p.image && p.image.trim() !== '').slice(0, 5);
  productsWithImage.forEach((p) => {
    console.log(`   - ${p.name}: ${p.image?.substring(0, 60)}...`);
  });
}

checkImages()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

