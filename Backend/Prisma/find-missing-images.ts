import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function findMissingImages() {
  console.log('🔍 Buscando imágenes faltantes o problemáticas...\n');

  // Verificar restaurantes
  const restaurants = await prisma.restaurant.findMany({
    select: {
      id: true,
      name: true,
      image: true,
    },
  });

  console.log('📊 RESTAURANTES:');
  console.log(`Total: ${restaurants.length}\n`);

  const restaurantsWithoutImage = restaurants.filter(
    (r) => !r.image || !r.image.startsWith('http') || !r.image.includes('unsplash')
  );

  if (restaurantsWithoutImage.length > 0) {
    console.log('❌ Restaurantes sin imagen válida:');
    restaurantsWithoutImage.forEach((r) => {
      console.log(`   - ${r.name} (ID: ${r.id})`);
      console.log(`     Imagen: ${r.image || 'SIN IMAGEN'}\n`);
    });
  } else {
    console.log('✅ Todos los restaurantes tienen imágenes válidas\n');
  }

  // Mostrar todas las imágenes para verificar
  console.log('\n📸 Todas las imágenes de restaurantes:');
  restaurants.forEach((r) => {
    console.log(`   ${r.name}: ${r.image?.substring(0, 70)}...`);
  });

  // Verificar productos
  const products = await prisma.product.findMany({
    where: {
      restaurantId: { not: 'market' },
    },
    select: {
      id: true,
      name: true,
      image: true,
      restaurantId: true,
    },
    take: 50, // Solo los primeros 50
  });

  console.log(`\n📊 PRODUCTOS (muestra de 50):`);
  console.log(`Total en muestra: ${products.length}\n`);

  const productsWithoutImage = products.filter(
    (p) => !p.image || !p.image.startsWith('http') || !p.image.includes('unsplash')
  );

  if (productsWithoutImage.length > 0) {
    console.log('❌ Productos sin imagen válida:');
    productsWithoutImage.forEach((p) => {
      console.log(`   - ${p.name} (Restaurant ID: ${p.restaurantId})`);
      console.log(`     Imagen: ${p.image || 'SIN IMAGEN'}\n`);
    });
  } else {
    console.log('✅ Todos los productos en la muestra tienen imágenes válidas');
  }
}

findMissingImages()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

