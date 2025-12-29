import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixTaqueriaImage() {
  console.log('🔧 Corrigiendo imagen de Taquería Los Amigos...\n');

  const restaurant = await prisma.restaurant.findFirst({
    where: { name: 'Taquería Los Amigos' },
  });

  if (!restaurant) {
    console.log('❌ Restaurante no encontrado');
    await prisma.$disconnect();
    return;
  }

  // URL con parámetros completos de optimización
  const correctImage = 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&q=80&fit=crop';

  console.log(`Imagen actual: ${restaurant.image}`);
  console.log(`Nueva imagen: ${correctImage}\n`);

  await prisma.restaurant.update({
    where: { id: restaurant.id },
    data: { image: correctImage },
  });

  console.log('✅ Imagen de Taquería Los Amigos actualizada correctamente');
}

fixTaqueriaImage()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

