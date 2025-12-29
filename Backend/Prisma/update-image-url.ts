import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Script para actualizar URLs de imágenes en la base de datos
 * 
 * Uso:
 * 1. Sube una imagen usando el endpoint /upload/product-image o /upload/restaurant-image
 * 2. Copia la URL de la respuesta
 * 3. Ejecuta este script para actualizar la imagen en la base de datos
 * 
 * Ejemplo:
 * ts-node Prisma/update-image-url.ts restaurant "restaurant-id" "https://res.cloudinary.com/..."
 */

async function updateImageUrl(
  type: 'restaurant' | 'product',
  id: string,
  imageUrl: string,
) {
  try {
    if (type === 'restaurant') {
      const restaurant = await prisma.restaurant.update({
        where: { id },
        data: { image: imageUrl },
      });
      console.log(`✅ Imagen actualizada para restaurante: ${restaurant.name}`);
      console.log(`   URL: ${imageUrl}`);
    } else if (type === 'product') {
      const product = await prisma.product.update({
        where: { id },
        data: { image: imageUrl },
      });
      console.log(`✅ Imagen actualizada para producto: ${product.name}`);
      console.log(`   URL: ${imageUrl}`);
    }
  } catch (error: any) {
    if (error.code === 'P2025') {
      console.error(`❌ No se encontró ${type} con ID: ${id}`);
    } else {
      console.error(`❌ Error al actualizar imagen:`, error.message);
    }
    process.exit(1);
  }
}

// Ejecutar desde línea de comandos
const args = process.argv.slice(2);

if (args.length !== 3) {
  console.log(`
📝 Uso: ts-node Prisma/update-image-url.ts <tipo> <id> <url>

Tipos:
  - restaurant: Actualiza imagen de restaurante
  - product: Actualiza imagen de producto

Ejemplo:
  ts-node Prisma/update-image-url.ts restaurant "abc123" "https://res.cloudinary.com/..."
  ts-node Prisma/update-image-url.ts product "xyz789" "https://res.cloudinary.com/..."
  `);
  process.exit(1);
}

const [type, id, url] = args;

if (type !== 'restaurant' && type !== 'product') {
  console.error('❌ Tipo inválido. Debe ser "restaurant" o "product"');
  process.exit(1);
}

updateImageUrl(type as 'restaurant' | 'product', id, url)
  .then(() => {
    console.log('\n🎉 ¡Actualización completada!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

