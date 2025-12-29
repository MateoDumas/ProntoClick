import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// URLs de imágenes específicas para cada restaurante
const restaurantImages: Record<string, string> = {
  'Wok & Roll': 'https://images.unsplash.com/photo-1563379091339-03246963d96a?w=800&q=80&fit=crop',
  'Tacos El Mexicano': 'https://images.unsplash.com/photo-1565299585323-38174c3d6c6e?w=800&q=80&fit=crop',
  'La Pizzería Italiana': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80&fit=crop',
  'Sushi Master': 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&q=80&fit=crop',
  'Burger Paradise': 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=80&fit=crop',
  'Ramen House': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80&fit=crop',
  'Curry Express': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80&fit=crop',
  'Thai Garden': 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800&q=80&fit=crop',
  'Mediterranean Breeze': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80&fit=crop',
  'Le Bistro Français': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80&fit=crop',
  'BBQ Smokehouse': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80&fit=crop',
  'Breakfast Club': 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&q=80&fit=crop',
  'Mercado ProntoClick': 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80&fit=crop',
};

async function fixRestaurantImages() {
  console.log('🔧 Actualizando imágenes de restaurantes...\n');

  const restaurants = await prisma.restaurant.findMany({
    select: {
      id: true,
      name: true,
      image: true,
    },
  });

  console.log(`📊 Total restaurantes: ${restaurants.length}\n`);

  let updated = 0;
  for (const restaurant of restaurants) {
    // Si tiene una imagen específica en el mapa, actualizarla
    const hasSpecificImage = restaurantImages[restaurant.name];
    
    // Verificar si no tiene imagen, tiene una URL inválida, o necesita actualización específica
    const needsUpdate = !restaurant.image || 
                       !restaurant.image.startsWith('http') ||
                       !restaurant.image.includes('unsplash') ||
                       (hasSpecificImage && restaurant.image !== hasSpecificImage);

    if (needsUpdate) {
      const newImage = restaurantImages[restaurant.name] || 
                      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80&fit=crop';

      await prisma.restaurant.update({
        where: { id: restaurant.id },
        data: { image: newImage },
      });

      console.log(`✅ ${restaurant.name} -> Imagen actualizada`);
      if (restaurant.image) {
        console.log(`   Antes: ${restaurant.image.substring(0, 60)}...`);
      } else {
        console.log(`   Antes: SIN IMAGEN`);
      }
      console.log(`   Ahora: ${newImage.substring(0, 60)}...\n`);
      updated++;
    }
  }

  console.log(`🎉 Actualización completada!`);
  console.log(`📊 Restaurantes actualizados: ${updated}`);
}

fixRestaurantImages()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

