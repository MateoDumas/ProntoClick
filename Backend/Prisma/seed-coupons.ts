import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedCoupons() {
  console.log('🎫 Seeding cupones...\n');

  // Cupones generales
  const coupons = [
    {
      code: 'BIENVENIDA10',
      description: '10% de descuento en tu primer pedido',
      discount: 10,
      type: 'percentage',
      minOrder: 20,
      maxDiscount: 5,
      isActive: true,
    },
    {
      code: 'DESCUENTO15',
      description: '15% de descuento en pedidos mayores a $30',
      discount: 15,
      type: 'percentage',
      minOrder: 30,
      maxDiscount: 10,
      isActive: true,
    },
    {
      code: 'FREESHIP',
      description: 'Envío gratis en pedidos mayores a $25',
      type: 'free_delivery',
      minOrder: 25,
      isActive: true,
    },
    {
      code: 'FIXED5',
      description: 'Descuento fijo de $5 en tu pedido',
      discountAmount: 5,
      type: 'fixed',
      minOrder: 15,
      isActive: true,
    },
    {
      code: 'FIXED10',
      description: 'Descuento fijo de $10 en pedidos mayores a $50',
      discountAmount: 10,
      type: 'fixed',
      minOrder: 50,
      isActive: true,
    },
    {
      code: 'VIP20',
      description: '20% de descuento exclusivo para usuarios VIP',
      discount: 20,
      type: 'percentage',
      minOrder: 40,
      maxDiscount: 15,
      userUsageLimit: 1,
      isActive: true,
    },
    {
      code: 'VIERNESGRATIS',
      description: 'Envío gratis en pedidos mayores a $30',
      type: 'free_delivery',
      minOrder: 30,
      isActive: true,
    },
  ];

  for (const coupon of coupons) {
    try {
      await prisma.coupon.upsert({
        where: { code: coupon.code },
        update: coupon,
        create: coupon,
      });
      console.log(`✅ Cupón ${coupon.code} creado/actualizado`);
    } catch (error) {
      console.error(`❌ Error al crear cupón ${coupon.code}:`, error);
    }
  }

  console.log('\n✨ Cupones seedeados correctamente!');
}

seedCoupons()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

