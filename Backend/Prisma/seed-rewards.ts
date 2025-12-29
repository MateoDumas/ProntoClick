import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedRewards() {
  console.log('🎁 Seeding recompensas...\n');

  const rewards = [
    {
      title: 'Cupón 10% de Descuento',
      description: 'Obtén un cupón con 10% de descuento en tu próximo pedido',
      pointsCost: 100,
      type: 'coupon',
      discount: 10,
      isActive: true,
      stock: null, // Ilimitado
    },
    {
      title: 'Cupón 15% de Descuento',
      description: 'Obtén un cupón con 15% de descuento en tu próximo pedido',
      pointsCost: 200,
      type: 'coupon',
      discount: 15,
      isActive: true,
      stock: null,
    },
    {
      title: 'Cupón 20% de Descuento',
      description: 'Obtén un cupón con 20% de descuento en tu próximo pedido',
      pointsCost: 300,
      type: 'coupon',
      discount: 20,
      isActive: true,
      stock: null,
    },
    {
      title: 'Cupón 50% de Descuento',
      description: 'Obtén un cupón con 50% de descuento en tu próximo pedido',
      pointsCost: 500,
      type: 'coupon',
      discount: 50,
      isActive: true,
      stock: null,
    },
    {
      title: 'Cupón 100% de Descuento',
      description: '¡Pedido GRATIS! Canjea este cupón para un pedido completamente gratis',
      pointsCost: 1000,
      type: 'coupon',
      discount: 100,
      isActive: true,
      stock: null,
    },
    {
      title: 'Descuento de $5',
      description: 'Cupón con descuento fijo de $5 en tu pedido',
      pointsCost: 150,
      type: 'discount',
      discountAmount: 5,
      isActive: true,
      stock: null,
    },
    {
      title: 'Descuento de $10',
      description: 'Cupón con descuento fijo de $10 en tu pedido',
      pointsCost: 250,
      type: 'discount',
      discountAmount: 10,
      isActive: true,
      stock: null,
    },
    {
      title: 'Envío Gratis',
      description: 'Cupón para envío gratis en tu próximo pedido',
      pointsCost: 80,
      type: 'free_delivery',
      isActive: true,
      stock: null,
    },
    {
      title: 'Bebida Gratis',
      description: 'Obtén una bebida gratis en tu próximo pedido',
      pointsCost: 50,
      type: 'free_item',
      isActive: true,
      stock: null,
    },
    {
      title: 'Postre Gratis',
      description: 'Obtén un postre gratis en tu próximo pedido',
      pointsCost: 75,
      type: 'free_item',
      isActive: true,
      stock: null,
    },
  ];

  // Limpiar recompensas existentes
  await prisma.userReward.deleteMany();
  await prisma.pointTransaction.deleteMany();
  await prisma.reward.deleteMany();
  console.log('✅ Recompensas anteriores eliminadas\n');

  for (const reward of rewards) {
    try {
      await prisma.reward.create({
        data: reward,
      });
      console.log(`✅ Recompensa "${reward.title}" creada (${reward.pointsCost} puntos)`);
    } catch (error) {
      console.error(`❌ Error al crear recompensa ${reward.title}:`, error);
    }
  }

  console.log('\n✨ Recompensas seedeadas correctamente!');
}

seedRewards()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

