import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixWokRollFinal() {
  console.log('🔧 Corrigiendo imagen de Wok & Roll (error 404)...\n');

  const restaurant = await prisma.restaurant.findFirst({
    where: { name: 'Wok & Roll' },
  });

  if (!restaurant) {
    console.log('❌ Restaurante no encontrado');
    await prisma.$disconnect();
    return;
  }

  console.log(`Imagen actual: ${restaurant.image}\n`);

  // Probar con una URL diferente de Unsplash para comida china
  // La URL actual está dando 404, así que usaremos una alternativa
  const alternativeImages = [
    'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80&fit=crop', // Comida china alternativa 1
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80&fit=crop', // Comida china alternativa 2
    'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&q=80&fit=crop', // Comida china alternativa 3
  ];

  // Usar la primera alternativa que debería funcionar
  const newImage = alternativeImages[0];

  await prisma.restaurant.update({
    where: { id: restaurant.id },
    data: { image: newImage },
  });

  console.log(`✅ Wok & Roll -> Imagen actualizada`);
  console.log(`   Antes: ${restaurant.image}`);
  console.log(`   Ahora: ${newImage}\n`);
  console.log('🎉 Imagen corregida!');
}

fixWokRollFinal()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

