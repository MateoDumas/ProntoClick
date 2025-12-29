import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixWokRollImages() {
  console.log('🔧 Actualizando imágenes de Wok & Roll...\n');

  // Obtener el restaurante Wok & Roll
  const restaurant = await prisma.restaurant.findFirst({
    where: { name: 'Wok & Roll' },
  });

  if (!restaurant) {
    console.log('❌ Restaurante Wok & Roll no encontrado');
    await prisma.$disconnect();
    return;
  }

  // Mapeo de productos con sus nuevas imágenes (URLs más específicas)
  const productImages: Record<string, string> = {
    'Pollo Agridulce': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80',
    'Chop Suey de Res': 'https://images.unsplash.com/photo-1563379091339-03246963d96a?w=400&q=80',
    'Dim Sum Mixto': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80',
    'Arroz Frito': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80',
    'Pastel de Luna': 'https://images.unsplash.com/photo-1606312619070-d48b4e55dc5f?w=400&q=80',
  };

  // Actualizar cada producto
  for (const [productName, imageUrl] of Object.entries(productImages)) {
    const product = await prisma.product.findFirst({
      where: {
        name: productName,
        restaurantId: restaurant.id,
      },
    });

    if (product) {
      await prisma.product.update({
        where: { id: product.id },
        data: { image: imageUrl },
      });
      console.log(`✅ ${productName} -> Imagen actualizada`);
    } else {
      console.log(`⚠️  ${productName} no encontrado`);
    }
  }

  console.log('\n🎉 Actualización completada!');
}

fixWokRollImages()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

