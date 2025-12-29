import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Mapeo de imágenes por tipo de restaurante/producto
const restaurantImages: Record<string, string> = {
  pizza: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800',
  sushi: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800',
  burger: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800',
  taco: 'https://images.unsplash.com/photo-1565299585323-38174c0d73ae?w=800',
  pasta: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800',
  asian: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
  chinese: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800',
  indian: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800',
  seafood: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800',
  bbq: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
  breakfast: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800',
  dessert: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800',
  coffee: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800',
  default: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
};

const productImages: Record<string, string> = {
  // Comida
  pizza: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
  hamburguesa: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400',
  sushi: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
  taco: 'https://images.unsplash.com/photo-1565299585323-38174c0d73ae?w=400',
  pasta: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400',
  ensalada: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
  sopa: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400',
  pollo: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400',
  pescado: 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=400',
  carne: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400',
  
  // Bebidas
  bebida: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400',
  refresco: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400',
  jugo: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400',
  cafe: 'https://images.unsplash.com/photo-1511920170033-83939cdc8da4?w=400',
  cerveza: 'https://images.unsplash.com/photo-1506377247727-4b5f3a0c714a?w=400',
  
  // Postres
  postre: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400',
  helado: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400',
  pastel: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400',
  
  // Tecnología
  tecnologia: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400',
  laptop: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
  telefono: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
  accesorio: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
  
  // Supermercado
  fruta: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400',
  verdura: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400',
  lacteo: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400',
  pan: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400',
  default: 'https://images.unsplash.com/photo-1556910096-6f5e72db6803?w=400',
};

function getRestaurantImage(name: string, description: string): string {
  const lowerName = name.toLowerCase();
  const lowerDesc = description.toLowerCase();

  // Buscar palabras clave
  if (lowerName.includes('pizza') || lowerDesc.includes('pizza')) {
    return restaurantImages.pizza;
  }
  if (lowerName.includes('sushi') || lowerDesc.includes('sushi')) {
    return restaurantImages.sushi;
  }
  if (lowerName.includes('burger') || lowerName.includes('hamburguesa') || lowerDesc.includes('burger')) {
    return restaurantImages.burger;
  }
  if (lowerName.includes('taco') || lowerDesc.includes('taco') || lowerDesc.includes('mexican')) {
    return restaurantImages.taco;
  }
  if (lowerName.includes('pasta') || lowerDesc.includes('pasta') || lowerDesc.includes('italian')) {
    return restaurantImages.pasta;
  }
  if (lowerName.includes('chinese') || lowerDesc.includes('chinese') || lowerDesc.includes('chino')) {
    return restaurantImages.chinese;
  }
  if (lowerName.includes('indian') || lowerDesc.includes('indian') || lowerDesc.includes('indio')) {
    return restaurantImages.indian;
  }
  if (lowerName.includes('seafood') || lowerDesc.includes('seafood') || lowerDesc.includes('marisco')) {
    return restaurantImages.seafood;
  }
  if (lowerName.includes('bbq') || lowerDesc.includes('bbq') || lowerDesc.includes('barbacoa')) {
    return restaurantImages.bbq;
  }
  if (lowerName.includes('breakfast') || lowerDesc.includes('breakfast') || lowerDesc.includes('desayuno')) {
    return restaurantImages.breakfast;
  }
  if (lowerName.includes('dessert') || lowerDesc.includes('dessert') || lowerDesc.includes('postre')) {
    return restaurantImages.dessert;
  }
  if (lowerName.includes('coffee') || lowerDesc.includes('coffee') || lowerDesc.includes('café')) {
    return restaurantImages.coffee;
  }
  if (lowerName.includes('asian') || lowerDesc.includes('asian') || lowerDesc.includes('asiático')) {
    return restaurantImages.asian;
  }

  return restaurantImages.default;
}

function getProductImage(name: string, description: string, category?: string | null): string {
  const lowerName = name.toLowerCase();
  const lowerDesc = description.toLowerCase();
  const lowerCategory = category?.toLowerCase() || '';

  // Buscar por categoría primero
  if (lowerCategory.includes('bebida') || lowerCategory.includes('drink')) {
    if (lowerName.includes('cafe') || lowerName.includes('coffee')) return productImages.cafe;
    if (lowerName.includes('cerveza') || lowerName.includes('beer')) return productImages.cerveza;
    if (lowerName.includes('jugo') || lowerName.includes('juice')) return productImages.jugo;
    if (lowerName.includes('refresco') || lowerName.includes('soda')) return productImages.refresco;
    return productImages.bebida;
  }

  if (lowerCategory.includes('postre') || lowerCategory.includes('dessert')) {
    if (lowerName.includes('helado') || lowerName.includes('ice cream')) return productImages.helado;
    if (lowerName.includes('pastel') || lowerName.includes('cake')) return productImages.pastel;
    return productImages.postre;
  }

  if (lowerCategory.includes('tecnologia') || lowerCategory.includes('technology')) {
    if (lowerName.includes('laptop') || lowerName.includes('notebook')) return productImages.laptop;
    if (lowerName.includes('telefono') || lowerName.includes('phone')) return productImages.telefono;
    if (lowerName.includes('accesorio') || lowerName.includes('accessory')) return productImages.accesorio;
    return productImages.tecnologia;
  }

  // Buscar por nombre/descripción
  if (lowerName.includes('pizza') || lowerDesc.includes('pizza')) return productImages.pizza;
  if (lowerName.includes('burger') || lowerName.includes('hamburguesa')) return productImages.hamburguesa;
  if (lowerName.includes('sushi') || lowerDesc.includes('sushi')) return productImages.sushi;
  if (lowerName.includes('taco') || lowerDesc.includes('taco')) return productImages.taco;
  if (lowerName.includes('pasta') || lowerDesc.includes('pasta')) return productImages.pasta;
  if (lowerName.includes('ensalada') || lowerDesc.includes('salad')) return productImages.ensalada;
  if (lowerName.includes('sopa') || lowerDesc.includes('soup')) return productImages.sopa;
  if (lowerName.includes('pollo') || lowerDesc.includes('chicken')) return productImages.pollo;
  if (lowerName.includes('pescado') || lowerDesc.includes('fish')) return productImages.pescado;
  if (lowerName.includes('carne') || lowerDesc.includes('beef') || lowerDesc.includes('meat')) return productImages.carne;
  if (lowerName.includes('fruta') || lowerDesc.includes('fruit')) return productImages.fruta;
  if (lowerName.includes('verdura') || lowerDesc.includes('vegetable')) return productImages.verdura;
  if (lowerName.includes('lacteo') || lowerDesc.includes('dairy')) return productImages.lacteo;
  if (lowerName.includes('pan') || lowerDesc.includes('bread')) return productImages.pan;

  return productImages.default;
}

async function addImages() {
  console.log('🖼️  Iniciando actualización de imágenes...\n');

  // Actualizar restaurantes sin imagen o con imagen inválida
  const allRestaurants = await prisma.restaurant.findMany();
  const restaurantsWithoutImage = allRestaurants.filter(
    (r) => !r.image || r.image.trim() === '' || !r.image.startsWith('http')
  );

  console.log(`📸 Encontrados ${restaurantsWithoutImage.length} restaurantes sin imagen`);

  for (const restaurant of restaurantsWithoutImage) {
    const image = getRestaurantImage(restaurant.name, restaurant.description);
    await prisma.restaurant.update({
      where: { id: restaurant.id },
      data: { image },
    });
    console.log(`  ✅ ${restaurant.name} -> Imagen agregada`);
  }

  // Actualizar productos sin imagen o con imagen inválida
  const allProducts = await prisma.product.findMany();
  const productsWithoutImage = allProducts.filter(
    (p) => !p.image || p.image.trim() === '' || !p.image.startsWith('http')
  );

  console.log(`\n📸 Encontrados ${productsWithoutImage.length} productos sin imagen`);

  for (const product of productsWithoutImage) {
    const image = getProductImage(product.name, product.description, product.category);
    await prisma.product.update({
      where: { id: product.id },
      data: { image },
    });
    console.log(`  ✅ ${product.name} -> Imagen agregada`);
  }

  console.log('\n🎉 Actualización de imágenes completada!');
  console.log(`📊 Restaurantes actualizados: ${restaurantsWithoutImage.length}`);
  console.log(`📊 Productos actualizados: ${productsWithoutImage.length}`);
}

addImages()
  .catch((e) => {
    console.error('❌ Error actualizando imágenes:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

