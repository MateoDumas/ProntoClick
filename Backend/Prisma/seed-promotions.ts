import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Función para crear la tabla si no existe
async function ensurePromotionTable() {
  try {
    // Verificar si la tabla existe
    const tableExists = await prisma.$queryRaw<Array<{ exists: boolean }>>`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'Promotion'
      );
    `;

    if (!tableExists[0]?.exists) {
      console.log('📦 Creando tabla Promotion...');
      await prisma.$executeRaw`
        CREATE TABLE "Promotion" (
          "id" TEXT NOT NULL,
          "title" TEXT NOT NULL,
          "description" TEXT NOT NULL,
          "discount" DOUBLE PRECISION,
          "discountAmount" DOUBLE PRECISION,
          "minOrder" DOUBLE PRECISION,
          "code" TEXT,
          "type" TEXT NOT NULL,
          "image" TEXT,
          "restaurantId" TEXT,
          "category" TEXT,
          "dayOfWeek" INTEGER,
          "startDate" TIMESTAMP(3),
          "endDate" TIMESTAMP(3),
          "isActive" BOOLEAN NOT NULL DEFAULT true,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "Promotion_pkey" PRIMARY KEY ("id")
        );
      `;

      await prisma.$executeRaw`
        CREATE INDEX IF NOT EXISTS "Promotion_isActive_idx" ON "Promotion"("isActive");
      `;

      await prisma.$executeRaw`
        CREATE INDEX IF NOT EXISTS "Promotion_dayOfWeek_idx" ON "Promotion"("dayOfWeek");
      `;

      await prisma.$executeRaw`
        CREATE INDEX IF NOT EXISTS "Promotion_restaurantId_idx" ON "Promotion"("restaurantId");
      `;

      // Agregar foreign key si la tabla Restaurant existe
      try {
        await prisma.$executeRaw`
          ALTER TABLE "Promotion" 
          ADD CONSTRAINT "Promotion_restaurantId_fkey" 
          FOREIGN KEY ("restaurantId") 
          REFERENCES "Restaurant"("id") 
          ON DELETE CASCADE 
          ON UPDATE CASCADE;
        `;
      } catch (e) {
        // La foreign key puede ya existir o la tabla Restaurant no existir
        console.log('⚠️  No se pudo agregar foreign key (puede que ya exista)');
      }

      console.log('✅ Tabla Promotion creada');
    } else {
      console.log('✅ Tabla Promotion ya existe');
    }
  } catch (error) {
    console.error('Error verificando/creando tabla:', error);
    throw error;
  }
}

async function seedPromotions() {
  console.log('🌱 Iniciando seed de promociones...');

  // Asegurar que la tabla existe
  await ensurePromotionTable();

  // Obtener algunos restaurantes para asociar promociones
  const restaurants = await prisma.restaurant.findMany({ take: 5 });

  const promotions = [
    // Promociones que rotan por día de la semana
    {
      title: 'Lunes de Pizza',
      description: '20% de descuento en todas las pizzas los lunes',
      discount: 20,
      type: 'percentage',
      category: 'restaurant',
      dayOfWeek: 1, // Lunes
      minOrder: 15,
      code: 'LUNES20',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800',
    },
    {
      title: 'Martes de Sushi',
      description: '15% OFF en pedidos de sushi este martes',
      discount: 15,
      type: 'percentage',
      category: 'restaurant',
      dayOfWeek: 2, // Martes
      minOrder: 20,
      code: 'MARTES15',
      image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800',
    },
    {
      title: 'Miércoles de Burgers',
      description: '2x1 en hamburguesas los miércoles',
      discount: 50,
      type: 'percentage',
      category: 'restaurant',
      dayOfWeek: 3, // Miércoles
      minOrder: 25,
      code: 'MIERCOLES2X1',
      image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800',
    },
    {
      title: 'Jueves de Tecnología',
      description: '10% de descuento en productos de tecnología',
      discount: 10,
      type: 'percentage',
      category: 'market',
      dayOfWeek: 4, // Jueves
      minOrder: 50,
      code: 'JUEVESTECH',
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
    },
    {
      title: 'Viernes Feliz',
      description: 'Envío gratis en pedidos mayores a $30',
      discount: null,
      discountAmount: null,
      type: 'free_delivery',
      category: 'all',
      dayOfWeek: 5, // Viernes
      minOrder: 30,
      code: 'VIERNESGRATIS',
      image: 'https://images.unsplash.com/photo-1556910096-6f5e72db6803?w=800',
    },
    {
      title: 'Sábado de Descuento',
      description: '25% OFF en tu primer pedido del sábado',
      discount: 25,
      type: 'percentage',
      category: 'all',
      dayOfWeek: 6, // Sábado
      minOrder: 20,
      code: 'SABADO25',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
    },
    {
      title: 'Domingo Familiar',
      description: 'Descuento del 30% en pedidos familiares',
      discount: 30,
      type: 'percentage',
      category: 'restaurant',
      dayOfWeek: 0, // Domingo
      minOrder: 40,
      code: 'DOMINGO30',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
    },
    // Promociones que aplican todos los días
    {
      title: 'Primera Compra',
      description: '15% de descuento en tu primer pedido',
      discount: 15,
      type: 'percentage',
      category: 'all',
      dayOfWeek: null, // Todos los días
      minOrder: 10,
      code: 'BIENVENIDO15',
      image: 'https://images.unsplash.com/photo-1556910096-6f5e72db6803?w=800',
    },
    {
      title: 'Envío Gratis',
      description: 'Envío gratis en pedidos superiores a $25',
      discount: null,
      discountAmount: null,
      type: 'free_delivery',
      category: 'all',
      dayOfWeek: null,
      minOrder: 25,
      code: null,
      image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=800',
    },
    {
      title: 'Combo Especial',
      description: 'Ahorra $10 en combos seleccionados',
      discountAmount: 10,
      type: 'fixed',
      category: 'restaurant',
      dayOfWeek: null,
      minOrder: 30,
      code: 'COMBO10',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
    },
    // Promociones específicas de restaurantes
    ...(restaurants.length > 0 ? [
      {
        title: `${restaurants[0].name} - Especial del Día`,
        description: '20% de descuento en todo el menú',
        discount: 20,
        type: 'percentage',
        category: 'restaurant',
        restaurantId: restaurants[0].id,
        dayOfWeek: new Date().getDay(), // Promoción del día actual
        minOrder: 15,
        code: 'ESPECIAL20',
        image: restaurants[0].image,
      },
    ] : []),
  ];

  // Limpiar promociones existentes
  await prisma.promotion.deleteMany();
  console.log('✅ Promociones anteriores eliminadas');

  // Crear promociones
  for (const promo of promotions) {
    await prisma.promotion.create({
      data: promo as any,
    });
  }

  console.log(`✅ ${promotions.length} promociones creadas`);
}

seedPromotions()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

