import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyAllImages() {
  console.log('🔍 Verificando todas las imágenes...\n');

  const restaurants = await prisma.restaurant.findMany();
  
  console.log('📊 RESTAURANTES:\n');
  restaurants.forEach((r, index) => {
    const hasImage = r.image && r.image.startsWith('http');
    const status = hasImage ? '✅' : '❌';
    console.log(`${status} ${index + 1}. ${r.name}`);
    if (r.image) {
      // Verificar si la URL tiene parámetros correctos
      const hasParams = r.image.includes('?w=') && r.image.includes('&q=');
      if (!hasParams && r.image.includes('unsplash')) {
        console.log(`   ⚠️  URL sin parámetros de optimización`);
        console.log(`   URL: ${r.image}`);
      }
    } else {
      console.log(`   ❌ SIN IMAGEN`);
    }
    console.log('');
  });

  // Verificar si hay URLs duplicadas
  const imageUrls = restaurants.map(r => r.image).filter(Boolean);
  const duplicates = imageUrls.filter((url, index) => imageUrls.indexOf(url) !== index);
  
  if (duplicates.length > 0) {
    console.log('\n⚠️  URLs duplicadas encontradas:');
    duplicates.forEach(url => {
      const restaurantsWithSameImage = restaurants.filter(r => r.image === url);
      console.log(`   URL: ${url.substring(0, 60)}...`);
      console.log(`   Usado por: ${restaurantsWithSameImage.map(r => r.name).join(', ')}\n`);
    });
  }
}

verifyAllImages()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

