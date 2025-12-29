import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function forceFixTacosImage() {
  console.log('🔧 Forzando actualización de imagen de Tacos El Mexicano...\n');

  const restaurant = await prisma.restaurant.findFirst({
    where: { name: 'Tacos El Mexicano' },
  });

  if (!restaurant) {
    console.log('❌ Restaurante no encontrado');
    await prisma.$disconnect();
    return;
  }

  // URL correcta para tacos mexicanos (diferente URL de Unsplash)
  const correctImage = 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&q=80&fit=crop';

  console.log(`Imagen actual: ${restaurant.image}`);
  console.log(`Nueva imagen: ${correctImage}\n`);

  await prisma.restaurant.update({
    where: { id: restaurant.id },
    data: { image: correctImage },
  });

  console.log('✅ Imagen de Tacos El Mexicano actualizada correctamente');
}

forceFixTacosImage()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

