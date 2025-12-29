import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// URLs de imágenes más confiables y específicas
const imageMap: Record<string, string> = {
  // Comida China
  'Pollo Agridulce': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80&fit=crop',
  'Chop Suey': 'https://images.unsplash.com/photo-1563379091339-03246963d96a?w=400&q=80&fit=crop',
  'Dim Sum': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80&fit=crop',
  'Arroz Frito': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80&fit=crop',
  'Pastel de Luna': 'https://images.unsplash.com/photo-1606312619070-d48b4e55dc5f?w=400&q=80&fit=crop',
  
  // Por palabras clave en el nombre
  'pollo': 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&q=80&fit=crop',
  'res': 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=400&q=80&fit=crop',
  'arroz': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80&fit=crop',
  'dim sum': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80&fit=crop',
  'chop suey': 'https://images.unsplash.com/photo-1563379091339-03246963d96a?w=400&q=80&fit=crop',
  'pastel': 'https://images.unsplash.com/photo-1606312619070-d48b4e55dc5f?w=400&q=80&fit=crop',
};

function getImageForProduct(name: string, description: string): string {
  const lowerName = name.toLowerCase();
  const lowerDesc = description.toLowerCase();

  // Buscar coincidencia exacta primero
  for (const [key, url] of Object.entries(imageMap)) {
    if (lowerName.includes(key.toLowerCase())) {
      return url;
    }
  }

  // Buscar por palabras clave
  if (lowerName.includes('pollo') || lowerDesc.includes('pollo')) {
    return imageMap['pollo'];
  }
  if (lowerName.includes('res') || lowerDesc.includes('res') || lowerDesc.includes('beef')) {
    return imageMap['res'];
  }
  if (lowerName.includes('arroz') || lowerDesc.includes('arroz') || lowerDesc.includes('rice')) {
    return imageMap['arroz'];
  }
  if (lowerName.includes('dim sum') || lowerDesc.includes('dim sum')) {
    return imageMap['dim sum'];
  }
  if (lowerName.includes('chop suey') || lowerDesc.includes('chop suey')) {
    return imageMap['chop suey'];
  }
  if (lowerName.includes('pastel') || lowerDesc.includes('pastel') || lowerDesc.includes('cake')) {
    return imageMap['pastel'];
  }

  // Imagen por defecto
  return 'https://images.unsplash.com/photo-1556910096-6f5e72db6803?w=400&q=80&fit=crop';
}

async function fixAllProductImages() {
  console.log('🔧 Actualizando imágenes de productos...\n');

  // Obtener todos los productos
  const products = await prisma.product.findMany({
    where: {
      restaurantId: { not: 'market' },
    },
  });

  console.log(`📊 Total productos encontrados: ${products.length}\n`);

  let updated = 0;
  for (const product of products) {
    // Verificar si la imagen actual es válida
    const hasValidImage = product.image && 
                         product.image.startsWith('http') && 
                         product.image.includes('unsplash');

    if (!hasValidImage) {
      const newImage = getImageForProduct(product.name, product.description);
      await prisma.product.update({
        where: { id: product.id },
        data: { image: newImage },
      });
      console.log(`✅ ${product.name} -> Imagen actualizada`);
      updated++;
    }
  }

  console.log(`\n🎉 Actualización completada!`);
  console.log(`📊 Productos actualizados: ${updated}`);
}

fixAllProductImages()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

