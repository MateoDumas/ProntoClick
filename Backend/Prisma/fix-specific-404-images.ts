import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixSpecific404Images() {
  console.log('🔧 Corrigiendo URLs específicas con error 404...\n');

  // URLs de reemplazo específicas por restaurante
  const restaurantReplacements: Record<string, string> = {
    'Tacos El Mexicano': 'https://images.unsplash.com/photo-1565299585323-38174c0d73ae?w=800&q=80&fit=crop',
    'Wok & Roll': 'https://images.unsplash.com/photo-1563379091339-03246963d96a?w=800&q=80&fit=crop',
  };

  // URLs problemáticas que dan 404
  const problematicUrlPatterns = [
    '1563379091339-03246963d96a',
    '1565299585323-38174c3d6c6e',
  ];

  // Buscar restaurantes con URLs problemáticas o imágenes incorrectas
  const restaurants = await prisma.restaurant.findMany();
  
  let updated = 0;
  for (const restaurant of restaurants) {
    // Si tiene una imagen de reemplazo específica, usarla
    if (restaurantReplacements[restaurant.name]) {
      const newUrl = restaurantReplacements[restaurant.name];
      if (restaurant.image !== newUrl) {
        await prisma.restaurant.update({
          where: { id: restaurant.id },
          data: { image: newUrl },
        });
        console.log(`✅ ${restaurant.name} -> Imagen actualizada`);
        console.log(`   Antes: ${restaurant.image}`);
        console.log(`   Ahora: ${newUrl}\n`);
        updated++;
        continue;
      }
    }

    // Verificar si tiene una URL problemática
    if (!restaurant.image) continue;

    for (const problematicUrl of problematicUrlPatterns) {
      if (restaurant.image.includes(problematicUrl)) {
        // Determinar URL de reemplazo basada en el nombre
        let newUrl = restaurantReplacements[restaurant.name] || 
                    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80&fit=crop';
        
        await prisma.restaurant.update({
          where: { id: restaurant.id },
          data: { image: newUrl },
        });
        console.log(`✅ ${restaurant.name} -> Imagen corregida (URL problemática)`);
        console.log(`   Antes: ${restaurant.image}`);
        console.log(`   Ahora: ${newUrl}\n`);
        updated++;
        break;
      }
    }
  }

  // También buscar en productos
  const products = await prisma.product.findMany({
    where: {
      restaurantId: { not: 'market' },
    },
  });

  for (const product of products) {
    if (!product.image) continue;

    for (const problematicUrl of problematicUrlPatterns) {
      if (product.image.includes(problematicUrl)) {
        // Determinar nueva URL basada en el tipo de producto
        let replacementUrl = 'https://images.unsplash.com/photo-1556910096-6f5e72db6803?w=400&q=80&fit=crop';
        if (product.name.toLowerCase().includes('taco') || product.name.toLowerCase().includes('mexican')) {
          replacementUrl = 'https://images.unsplash.com/photo-1565299585323-38174c0d73ae?w=400&q=80&fit=crop';
        } else if (product.name.toLowerCase().includes('chop suey') || product.name.toLowerCase().includes('chinese')) {
          replacementUrl = 'https://images.unsplash.com/photo-1563379091339-03246963d96a?w=400&q=80&fit=crop';
        }

        await prisma.product.update({
          where: { id: product.id },
          data: { image: replacementUrl },
        });
        console.log(`✅ Producto: ${product.name} -> Imagen actualizada`);
        console.log(`   Antes: ${product.image}`);
        console.log(`   Ahora: ${replacementUrl}\n`);
        updated++;
        break;
      }
    }
  }

  console.log(`🎉 Actualización completada!`);
  console.log(`📊 Total actualizado: ${updated}`);
}

fixSpecific404Images()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
