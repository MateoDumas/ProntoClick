import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fix404Images() {
  console.log('🔧 Buscando y corrigiendo imágenes con URLs problemáticas...\n');

  // URLs problemáticas que están dando 404
  const problematicUrls = [
    '1563379091339',
    '1606312619070',
  ];

  // URLs de reemplazo más confiables
  const replacementImages: Record<string, string> = {
    // Comida china
    'chop suey': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80&fit=crop',
    'arroz frito': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80&fit=crop',
    'dim sum': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80&fit=crop',
    'pollo agridulce': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80&fit=crop',
    'pastel de luna': 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400&q=80&fit=crop',
    'mooncake': 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400&q=80&fit=crop',
  };

  // Buscar productos con URLs problemáticas
  const allProducts = await prisma.product.findMany({
    where: {
      restaurantId: { not: 'market' },
    },
  });

  let updated = 0;
  for (const product of allProducts) {
    if (!product.image) continue;

    // Verificar si tiene una URL problemática
    const hasProblematicUrl = problematicUrls.some(url => product.image?.includes(url));

    if (hasProblematicUrl) {
      // Buscar imagen de reemplazo basada en el nombre
      const lowerName = product.name.toLowerCase();
      let newImage = 'https://images.unsplash.com/photo-1556910096-6f5e72db6803?w=400&q=80&fit=crop'; // Default

      for (const [key, url] of Object.entries(replacementImages)) {
        if (lowerName.includes(key)) {
          newImage = url;
          break;
        }
      }

      await prisma.product.update({
        where: { id: product.id },
        data: { image: newImage },
      });

      console.log(`✅ ${product.name} -> Imagen actualizada`);
      console.log(`   Antes: ${product.image?.substring(0, 60)}...`);
      console.log(`   Ahora: ${newImage.substring(0, 60)}...\n`);
      updated++;
    }
  }

  console.log(`🎉 Actualización completada!`);
  console.log(`📊 Productos actualizados: ${updated}`);
}

fix404Images()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

