import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function listAllImages() {
  console.log('📸 LISTADO DE TODAS LAS IMÁGENES\n');
  console.log('=' .repeat(80));
  
  // Restaurantes
  console.log('\n🏪 RESTAURANTES:\n');
  const restaurants = await prisma.restaurant.findMany({
    orderBy: { name: 'asc' },
  });

  restaurants.forEach((r, index) => {
    console.log(`${index + 1}. ${r.name}`);
    console.log(`   ID: ${r.id}`);
    console.log(`   Imagen: ${r.image || 'SIN IMAGEN'}`);
    console.log('');
  });

  // Productos (primeros 30 para no saturar)
  console.log('\n' + '='.repeat(80));
  console.log('\n🍽️  PRODUCTOS (primeros 30):\n');
  const products = await prisma.product.findMany({
    where: {
      restaurantId: { not: 'market' },
    },
    orderBy: { name: 'asc' },
    take: 30,
  });

  products.forEach((p, index) => {
    console.log(`${index + 1}. ${p.name}`);
    console.log(`   ID: ${p.id}`);
    console.log(`   Restaurante ID: ${p.restaurantId}`);
    console.log(`   Imagen: ${p.image || 'SIN IMAGEN'}`);
    console.log('');
  });

  // Detectar duplicados
  console.log('\n' + '='.repeat(80));
  console.log('\n🔍 DETECCIÓN DE IMÁGENES DUPLICADAS:\n');

  // Duplicados en restaurantes
  const restaurantImages = restaurants.map(r => ({ name: r.name, image: r.image })).filter(r => r.image);
  const restaurantImageMap = new Map<string, string[]>();
  restaurantImages.forEach(r => {
    if (!restaurantImageMap.has(r.image!)) {
      restaurantImageMap.set(r.image!, []);
    }
    restaurantImageMap.get(r.image!)!.push(r.name);
  });

  const duplicateRestaurantImages = Array.from(restaurantImageMap.entries())
    .filter(([_, names]) => names.length > 1);

  if (duplicateRestaurantImages.length > 0) {
    console.log('⚠️  Restaurantes con imágenes duplicadas:');
    duplicateRestaurantImages.forEach(([image, names]) => {
      console.log(`\n   URL: ${image.substring(0, 70)}...`);
      console.log(`   Usado por: ${names.join(', ')}`);
    });
  } else {
    console.log('✅ No hay imágenes duplicadas en restaurantes');
  }

  // Duplicados en productos
  const productImages = products.map(p => ({ name: p.name, image: p.image })).filter(p => p.image);
  const productImageMap = new Map<string, string[]>();
  productImages.forEach(p => {
    if (!productImageMap.has(p.image!)) {
      productImageMap.set(p.image!, []);
    }
    productImageMap.get(p.image!)!.push(p.name);
  });

  const duplicateProductImages = Array.from(productImageMap.entries())
    .filter(([_, names]) => names.length > 1);

  if (duplicateProductImages.length > 0) {
    console.log('\n⚠️  Productos con imágenes duplicadas:');
    duplicateProductImages.forEach(([image, names]) => {
      console.log(`\n   URL: ${image.substring(0, 70)}...`);
      console.log(`   Usado por: ${names.join(', ')}`);
    });
  } else {
    console.log('\n✅ No hay imágenes duplicadas en productos (muestra)');
  }

  console.log('\n' + '='.repeat(80));
  console.log('\n💡 DÓNDE CAMBIAR LAS IMÁGENES:');
  console.log('\n1. En el código (seed): Backend/Prisma/seed.ts');
  console.log('   - Líneas ~18-135: Restaurantes');
  console.log('   - Líneas ~200-1020: Productos');
  console.log('\n2. Directamente en la base de datos:');
  console.log('   - Ejecuta: cd Backend && npx prisma studio');
  console.log('   - Abre las tablas "Restaurant" y "Product"');
  console.log('   - Edita el campo "image" de cada registro');
  console.log('\n3. Usando scripts de actualización:');
  console.log('   - Backend/Prisma/add-images.ts (actualiza automáticamente)');
  console.log('   - Backend/Prisma/fix-*.ts (scripts específicos)');
}

listAllImages()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

