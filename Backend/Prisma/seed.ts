import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Limpiar datos existentes
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.restaurant.deleteMany();
  console.log('✅ Datos anteriores eliminados');

  // ========== RESTAURANTES ==========

  // 1. La Pizzería Italiana
  const restaurant1 = await prisma.restaurant.create({
    data: {
      name: 'La Pizzería Italiana',
      description: 'Auténtica pizza italiana con ingredientes frescos importados directamente de Italia',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800',
      rating: 4.8,
      deliveryTime: '25-35 min',
      minOrder: 15.99,
    },
  });

  // 2. Sushi Master
  const restaurant2 = await prisma.restaurant.create({
    data: {
      name: 'Sushi Master',
      description: 'Sushi fresco preparado por chefs japoneses. Los mejores rolls y sashimi de la ciudad',
      image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800',
      rating: 4.9,
      deliveryTime: '30-40 min',
      minOrder: 20.00,
    },
  });

  // 3. Burger Paradise
  const restaurant3 = await prisma.restaurant.create({
    data: {
      name: 'Burger Paradise',
      description: 'Hamburguesas gourmet con carne 100% angus y papas artesanales. El sabor que buscas',
      image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800',
      rating: 4.7,
      deliveryTime: '20-30 min',
      minOrder: 12.99,
    },
  });

  // 4. Tacos El Mexicano
  const restaurant4 = await prisma.restaurant.create({
    data: {
      name: 'Tacos El Mexicano',
      description: 'Tacos auténticos con salsas caseras y los mejores cortes de carne. Tradición mexicana',
      image: 'https://images.unsplash.com/photo-1565299585323-38174c3d6c6e?w=800',
      rating: 4.6,
      deliveryTime: '15-25 min',
      minOrder: 10.00,
    },
  });

  // 5. Ramen House
  const restaurant5 = await prisma.restaurant.create({
    data: {
      name: 'Ramen House',
      description: 'Ramen tradicional japonés con caldo hecho durante 12 horas. Experiencia única',
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800',
      rating: 4.9,
      deliveryTime: '25-35 min',
      minOrder: 18.50,
    },
  });

  // 6. Curry Express (India)
  const restaurant6 = await prisma.restaurant.create({
    data: {
      name: 'Curry Express',
      description: 'Sabores auténticos de la India. Curries, biryanis y tandoori preparados con especias tradicionales',
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800',
      rating: 4.7,
      deliveryTime: '30-40 min',
      minOrder: 16.00,
    },
  });

  // 7. Wok & Roll (China)
  const restaurant7 = await prisma.restaurant.create({
    data: {
      name: 'Wok & Roll',
      description: 'Comida china auténtica. Chop suey, pollo agridulce y dim sum recién preparados',
      image: 'https://images.unsplash.com/photo-1563379091339-03246963d96a?w=800',
      rating: 4.6,
      deliveryTime: '25-35 min',
      minOrder: 14.99,
    },
  });

  // 8. Taquería Los Amigos
  const restaurant8 = await prisma.restaurant.create({
    data: {
      name: 'Taquería Los Amigos',
      description: 'Los mejores tacos, burritos y quesadillas. Sabor mexicano auténtico en cada bocado',
      image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800',
      rating: 4.8,
      deliveryTime: '20-30 min',
      minOrder: 11.50,
    },
  });

  // 9. Thai Garden
  const restaurant9 = await prisma.restaurant.create({
    data: {
      name: 'Thai Garden',
      description: 'Cocina tailandesa tradicional. Pad Thai, curries y sopas con el equilibrio perfecto de sabores',
      image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800',
      rating: 4.8,
      deliveryTime: '30-40 min',
      minOrder: 17.00,
    },
  });

  // 10. Mediterranean Breeze
  const restaurant10 = await prisma.restaurant.create({
    data: {
      name: 'Mediterranean Breeze',
      description: 'Sabores del Mediterráneo. Gyros, falafel, hummus y platos griegos y libaneses',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
      rating: 4.7,
      deliveryTime: '25-35 min',
      minOrder: 15.00,
    },
  });

  // 11. Le Bistro Français
  const restaurant11 = await prisma.restaurant.create({
    data: {
      name: 'Le Bistro Français',
      description: 'Cocina francesa elegante. Coq au vin, ratatouille y croissants artesanales',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
      rating: 4.9,
      deliveryTime: '35-45 min',
      minOrder: 22.00,
    },
  });

  // 12. BBQ Smokehouse
  const restaurant12 = await prisma.restaurant.create({
    data: {
      name: 'BBQ Smokehouse',
      description: 'Barbacoa estilo americano. Costillas, pulled pork y brisket ahumados lentamente',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
      rating: 4.8,
      deliveryTime: '30-40 min',
      minOrder: 18.00,
    },
  });

  // 13. Seoul BBQ (Coreana)
  const restaurant13 = await prisma.restaurant.create({
    data: {
      name: 'Seoul BBQ',
      description: 'Barbacoa coreana auténtica. Bulgogi, galbi y kimchi preparados tradicionalmente',
      image: 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=800&q=80&fit=crop',
      rating: 4.8,
      deliveryTime: '25-35 min',
      minOrder: 19.00,
    },
  });

  // 14. Pho Saigon (Vietnamita)
  const restaurant14 = await prisma.restaurant.create({
    data: {
      name: 'Pho Saigon',
      description: 'Cocina vietnamita tradicional. Pho, banh mi y rollitos primavera frescos',
      image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800&q=80&fit=crop',
      rating: 4.7,
      deliveryTime: '20-30 min',
      minOrder: 14.50,
    },
  });

  // 15. Churrascaria Brasil (Brasileña)
  const restaurant15 = await prisma.restaurant.create({
    data: {
      name: 'Churrascaria Brasil',
      description: 'Carnes asadas estilo brasileño. Picanha, feijoada y caipirinhas auténticas',
      image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=800&q=80&fit=crop',
      rating: 4.9,
      deliveryTime: '35-45 min',
      minOrder: 24.00,
    },
  });

  // 16. Cevichería El Peruano (Peruana)
  const restaurant16 = await prisma.restaurant.create({
    data: {
      name: 'Cevichería El Peruano',
      description: 'Ceviche peruano fresco y lomo saltado. Sabores auténticos de Perú',
      image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80&fit=crop',
      rating: 4.8,
      deliveryTime: '25-35 min',
      minOrder: 16.00,
    },
  });

  // 17. La Taberna Española (Española)
  const restaurant17 = await prisma.restaurant.create({
    data: {
      name: 'La Taberna Española',
      description: 'Tapas, paella y jamón ibérico. Tradición española en cada plato',
      image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&q=80&fit=crop',
      rating: 4.7,
      deliveryTime: '30-40 min',
      minOrder: 20.00,
    },
  });

  // 18. Istanbul Kebab (Turca)
  const restaurant18 = await prisma.restaurant.create({
    data: {
      name: 'Istanbul Kebab',
      description: 'Kebabs turcos, baklava y meze. Sabores del Bósforo en tu mesa',
      image: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=800&q=80&fit=crop',
      rating: 4.6,
      deliveryTime: '20-30 min',
      minOrder: 13.50,
    },
  });

  // 19. Biergarten (Alemana)
  const restaurant19 = await prisma.restaurant.create({
    data: {
      name: 'Biergarten',
      description: 'Schnitzel, bratwurst y cerveza alemana. Auténtica cocina bávara',
      image: 'https://images.unsplash.com/photo-1556910096-6f5e72db6803?w=800&q=80&fit=crop',
      rating: 4.7,
      deliveryTime: '25-35 min',
      minOrder: 17.00,
    },
  });

  // 20. El Asador Argentino (Argentina)
  const restaurant20 = await prisma.restaurant.create({
    data: {
      name: 'El Asador Argentino',
      description: 'Asado argentino, empanadas y chimichurri. La mejor carne del mundo',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80&fit=crop',
      rating: 4.9,
      deliveryTime: '30-40 min',
      minOrder: 22.00,
    },
  });

  // 21. Aladdin's Kitchen (Libanesa)
  const restaurant21 = await prisma.restaurant.create({
    data: {
      name: "Aladdin's Kitchen",
      description: 'Shawarma, hummus, falafel y mezze. Sabores del Líbano auténticos',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80&fit=crop',
      rating: 4.8,
      deliveryTime: '20-30 min',
      minOrder: 15.50,
    },
  });

  // 22. Abyssinia (Etiope)
  const restaurant22 = await prisma.restaurant.create({
    data: {
      name: 'Abyssinia',
      description: 'Injera, doro wat y platos etíopes tradicionales. Sabores únicos de África',
      image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&q=80&fit=crop',
      rating: 4.6,
      deliveryTime: '30-40 min',
      minOrder: 18.50,
    },
  });

  // 23. Marrakech Express (Marroquí)
  const restaurant23 = await prisma.restaurant.create({
    data: {
      name: 'Marrakech Express',
      description: 'Tagine, couscous y pastela. Aromas y sabores del Magreb',
      image: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=800&q=80&fit=crop',
      rating: 4.7,
      deliveryTime: '25-35 min',
      minOrder: 16.50,
    },
  });

  // 24. Opa! Greek Taverna (Griega)
  const restaurant24 = await prisma.restaurant.create({
    data: {
      name: "Opa! Greek Taverna",
      description: 'Souvlaki, moussaka y gyros. Auténtica cocina griega mediterránea',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80&fit=crop',
      rating: 4.8,
      deliveryTime: '25-35 min',
      minOrder: 15.00,
    },
  });

  console.log('✅ Restaurantes creados');

  // ========== PRODUCTOS ==========

  // La Pizzería Italiana - Pizzas, Pastas, Bebidas, Postres
  await prisma.product.createMany({
    data: [
      {
        name: 'Pizza Margherita',
        description: 'Salsa de tomate, mozzarella fresca y albahaca',
        price: 12.99,
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
        category: 'Pizzas',
        restaurantId: restaurant1.id,
      },
      {
        name: 'Pizza Pepperoni',
        description: 'Salsa de tomate, mozzarella y pepperoni',
        price: 14.99,
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400',
        category: 'Pizzas',
        restaurantId: restaurant1.id,
      },
      {
        name: 'Pizza Cuatro Quesos',
        description: 'Mozzarella, gorgonzola, parmesano y provolone',
        price: 16.99,
        image: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=400',
        category: 'Pizzas',
        restaurantId: restaurant1.id,
      },
      {
        name: 'Lasagna Casera',
        description: 'Pasta casera con carne, bechamel y queso',
        price: 15.99,
        image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400',
        category: 'Pastas',
        restaurantId: restaurant1.id,
      },
      {
        name: 'Spaghetti Carbonara',
        description: 'Pasta con pancetta, huevo y parmesano',
        price: 13.99,
        image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400',
        category: 'Pastas',
        restaurantId: restaurant1.id,
      },
      {
        name: 'Tiramisú',
        description: 'Postre italiano clásico con café, mascarpone y cacao',
        price: 7.99,
        image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400',
        category: 'Postres',
        restaurantId: restaurant1.id,
      },
      {
        name: 'Cannoli Siciliano',
        description: 'Tubos de masa frita rellenos de ricotta y chocolate',
        price: 6.99,
        image: 'https://images.unsplash.com/photo-1606312619070-d48b4e55dc5f?w=400',
        category: 'Postres',
        restaurantId: restaurant1.id,
      },
      {
        name: 'Vino Tinto de la Casa',
        description: 'Vino italiano seleccionado',
        price: 12.99,
        image: 'https://images.unsplash.com/photo-1506377247727-4b5f3a0c714a?w=400',
        category: 'Bebidas',
        restaurantId: restaurant1.id,
      },
      {
        name: 'Limonada Italiana',
        description: 'Limonada fresca con menta y limón',
        price: 4.99,
        image: 'https://images.unsplash.com/photo-1523677011781-c91d1bbe2fdc?w=400',
        category: 'Bebidas',
        restaurantId: restaurant1.id,
      },
    ],
  });

  // Sushi Master - Rolls, Sashimi, Bebidas, Postres
  await prisma.product.createMany({
    data: [
      {
        name: 'Roll California',
        description: 'Cangrejo, aguacate y pepino',
        price: 8.99,
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
        category: 'Rolls',
        restaurantId: restaurant2.id,
      },
      {
        name: 'Roll Philadelphia',
        description: 'Salmón, queso crema y aguacate',
        price: 10.99,
        image: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=400',
        category: 'Rolls',
        restaurantId: restaurant2.id,
      },
      {
        name: 'Sashimi de Salmón',
        description: '6 piezas de salmón fresco',
        price: 12.99,
        image: 'https://images.unsplash.com/photo-1617196034183-421b4917c92d?w=400',
        category: 'Sashimi',
        restaurantId: restaurant2.id,
      },
      {
        name: 'Sashimi Mixto',
        description: '12 piezas de pescado variado',
        price: 18.99,
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
        category: 'Sashimi',
        restaurantId: restaurant2.id,
      },
      {
        name: 'Miso Soup',
        description: 'Sopa tradicional japonesa',
        price: 4.99,
        image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400',
        category: 'Sopas',
        restaurantId: restaurant2.id,
      },
      {
        name: 'Mochi de Fresa',
        description: 'Postre japonés de arroz con relleno de fresa',
        price: 5.99,
        image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400',
        category: 'Postres',
        restaurantId: restaurant2.id,
      },
      {
        name: 'Dorayaki',
        description: 'Panqueques japoneses rellenos de anko (pasta de frijol dulce)',
        price: 6.99,
        image: 'https://images.unsplash.com/photo-1606312619070-d48b4e55dc5f?w=400',
        category: 'Postres',
        restaurantId: restaurant2.id,
      },
      {
        name: 'Sake Premium',
        description: 'Sake japonés de alta calidad',
        price: 15.99,
        image: 'https://images.unsplash.com/photo-1506377247727-4b5f3a0c714a?w=400',
        category: 'Bebidas',
        restaurantId: restaurant2.id,
      },
      {
        name: 'Té Verde Japonés',
        description: 'Té verde matcha tradicional',
        price: 3.99,
        image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400',
        category: 'Bebidas',
        restaurantId: restaurant2.id,
      },
    ],
  });

  // Burger Paradise - Hamburguesas, Acompañamientos, Bebidas, Postres
  await prisma.product.createMany({
    data: [
      {
        name: 'Burger Clásica',
        description: 'Carne angus, lechuga, tomate, cebolla y salsa especial',
        price: 9.99,
        image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400',
        category: 'Hamburguesas',
        restaurantId: restaurant3.id,
      },
      {
        name: 'Burger BBQ',
        description: 'Carne angus, bacon, cebolla caramelizada y salsa BBQ',
        price: 12.99,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
        category: 'Hamburguesas',
        restaurantId: restaurant3.id,
      },
      {
        name: 'Burger Doble Carne',
        description: 'Doble carne angus, doble queso y todos los complementos',
        price: 15.99,
        image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433w?w=400',
        category: 'Hamburguesas',
        restaurantId: restaurant3.id,
      },
      {
        name: 'Papas Fritas',
        description: 'Papas artesanales con sal marina',
        price: 4.99,
        image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400',
        category: 'Acompañamientos',
        restaurantId: restaurant3.id,
      },
      {
        name: 'Onion Rings',
        description: 'Aros de cebolla empanizados',
        price: 5.99,
        image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400',
        category: 'Acompañamientos',
        restaurantId: restaurant3.id,
      },
      {
        name: 'Milkshake de Vainilla',
        description: 'Batido cremoso de vainilla con crema batida',
        price: 5.99,
        image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400',
        category: 'Bebidas',
        restaurantId: restaurant3.id,
      },
      {
        name: 'Coca Cola',
        description: 'Refresco de cola',
        price: 2.99,
        image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400',
        category: 'Bebidas',
        restaurantId: restaurant3.id,
      },
      {
        name: 'Brownie con Helado',
        description: 'Brownie caliente con helado de vainilla',
        price: 6.99,
        image: 'https://images.unsplash.com/photo-1606312619070-d48b4e55dc5f?w=400',
        category: 'Postres',
        restaurantId: restaurant3.id,
      },
      {
        name: 'Apple Pie',
        description: 'Pastel de manzana casero con canela',
        price: 5.99,
        image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400',
        category: 'Postres',
        restaurantId: restaurant3.id,
      },
    ],
  });

  // Tacos El Mexicano - Tacos, Antojitos, Bebidas, Postres
  await prisma.product.createMany({
    data: [
      {
        name: 'Tacos de Asada',
        description: '3 tacos de carne asada con cebolla y cilantro',
        price: 8.99,
        image: 'https://images.unsplash.com/photo-1565299585323-38174c3d6c6e?w=400',
        category: 'Tacos',
        restaurantId: restaurant4.id,
      },
      {
        name: 'Tacos de Pastor',
        description: '3 tacos de pastor con piña y cebolla',
        price: 8.99,
        image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400',
        category: 'Tacos',
        restaurantId: restaurant4.id,
      },
      {
        name: 'Tacos de Pollo',
        description: '3 tacos de pollo con salsa verde',
        price: 7.99,
        image: 'https://images.unsplash.com/photo-1565299585323-38174c3d6c6e?w=400',
        category: 'Tacos',
        restaurantId: restaurant4.id,
      },
      {
        name: 'Quesadillas',
        description: '2 quesadillas de queso con salsa',
        price: 6.99,
        image: 'https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=400',
        category: 'Antojitos',
        restaurantId: restaurant4.id,
      },
      {
        name: 'Guacamole',
        description: 'Guacamole fresco con totopos',
        price: 5.99,
        image: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=400',
        category: 'Acompañamientos',
        restaurantId: restaurant4.id,
      },
      {
        name: 'Horchata',
        description: 'Bebida tradicional de arroz con canela',
        price: 3.99,
        image: 'https://images.unsplash.com/photo-1523677011781-c91d1bbe2fdc?w=400',
        category: 'Bebidas',
        restaurantId: restaurant4.id,
      },
      {
        name: 'Jamaica',
        description: 'Agua de jamaica fresca',
        price: 3.99,
        image: 'https://images.unsplash.com/photo-1523677011781-c91d1bbe2fdc?w=400',
        category: 'Bebidas',
        restaurantId: restaurant4.id,
      },
      {
        name: 'Tres Leches',
        description: 'Pastel de tres leches tradicional',
        price: 6.99,
        image: 'https://images.unsplash.com/photo-1606312619070-d48b4e55dc5f?w=400',
        category: 'Postres',
        restaurantId: restaurant4.id,
      },
      {
        name: 'Flan Napolitano',
        description: 'Flan casero con caramelo',
        price: 5.99,
        image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400',
        category: 'Postres',
        restaurantId: restaurant4.id,
      },
    ],
  });

  // Ramen House - Ramen, Acompañamientos, Bebidas, Postres
  await prisma.product.createMany({
    data: [
      {
        name: 'Ramen Shoyu',
        description: 'Caldo de soja con fideos, huevo y cerdo',
        price: 14.99,
        image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400',
        category: 'Ramen',
        restaurantId: restaurant5.id,
      },
      {
        name: 'Ramen Miso',
        description: 'Caldo de miso con fideos, cerdo y vegetales',
        price: 15.99,
        image: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=400',
        category: 'Ramen',
        restaurantId: restaurant5.id,
      },
      {
        name: 'Ramen Tonkotsu',
        description: 'Caldo de cerdo cremoso con fideos y chashu',
        price: 16.99,
        image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400',
        category: 'Ramen',
        restaurantId: restaurant5.id,
      },
      {
        name: 'Gyoza',
        description: '6 empanadillas japonesas al vapor',
        price: 7.99,
        image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400',
        category: 'Acompañamientos',
        restaurantId: restaurant5.id,
      },
      {
        name: 'Edamame',
        description: 'Soja verde al vapor con sal',
        price: 4.99,
        image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400',
        category: 'Acompañamientos',
        restaurantId: restaurant5.id,
      },
      {
        name: 'Té Verde Caliente',
        description: 'Té verde japonés tradicional',
        price: 3.99,
        image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400',
        category: 'Bebidas',
        restaurantId: restaurant5.id,
      },
      {
        name: 'Ramune',
        description: 'Refresco japonés con sabor a limón',
        price: 4.99,
        image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400',
        category: 'Bebidas',
        restaurantId: restaurant5.id,
      },
      {
        name: 'Mochi de Matcha',
        description: 'Mochi relleno de helado de matcha',
        price: 6.99,
        image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400',
        category: 'Postres',
        restaurantId: restaurant5.id,
      },
    ],
  });

  // Curry Express (India) - Curries, Biryanis, Bebidas, Postres
  await prisma.product.createMany({
    data: [
      {
        name: 'Butter Chicken',
        description: 'Pollo en salsa cremosa de mantequilla y tomate',
        price: 16.99,
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400',
        category: 'Curries',
        restaurantId: restaurant6.id,
      },
      {
        name: 'Chicken Tikka Masala',
        description: 'Pollo marinado en salsa de tomate y especias',
        price: 17.99,
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400',
        category: 'Curries',
        restaurantId: restaurant6.id,
      },
      {
        name: 'Lamb Biryani',
        description: 'Arroz basmati con cordero y especias',
        price: 18.99,
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400',
        category: 'Biryanis',
        restaurantId: restaurant6.id,
      },
      {
        name: 'Vegetable Biryani',
        description: 'Arroz basmati con vegetales y especias',
        price: 14.99,
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400',
        category: 'Biryanis',
        restaurantId: restaurant6.id,
      },
      {
        name: 'Naan Tradicional',
        description: 'Pan indio horneado en tandoor',
        price: 3.99,
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400',
        category: 'Acompañamientos',
        restaurantId: restaurant6.id,
      },
      {
        name: 'Lassi de Mango',
        description: 'Bebida de yogur con mango',
        price: 4.99,
        image: 'https://images.unsplash.com/photo-1523677011781-c91d1bbe2fdc?w=400',
        category: 'Bebidas',
        restaurantId: restaurant6.id,
      },
      {
        name: 'Chai Masala',
        description: 'Té indio con especias',
        price: 3.99,
        image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400',
        category: 'Bebidas',
        restaurantId: restaurant6.id,
      },
      {
        name: 'Gulab Jamun',
        description: 'Bolitas de leche fritas en almíbar',
        price: 5.99,
        image: 'https://images.unsplash.com/photo-1606312619070-d48b4e55dc5f?w=400',
        category: 'Postres',
        restaurantId: restaurant6.id,
      },
      {
        name: 'Kulfi',
        description: 'Helado indio tradicional',
        price: 4.99,
        image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400',
        category: 'Postres',
        restaurantId: restaurant6.id,
      },
    ],
  });

  // Wok & Roll (China) - Platos Principales, Bebidas, Postres
  await prisma.product.createMany({
    data: [
      {
        name: 'Pollo Agridulce',
        description: 'Pollo frito con salsa agridulce y vegetales',
        price: 13.99,
        image: 'https://images.unsplash.com/photo-1563379091339-03246963d96a?w=400',
        category: 'Platos Principales',
        restaurantId: restaurant7.id,
      },
      {
        name: 'Chop Suey de Res',
        description: 'Res salteada con vegetales y salsa',
        price: 14.99,
        image: 'https://images.unsplash.com/photo-1563379091339-03246963d96a?w=400',
        category: 'Platos Principales',
        restaurantId: restaurant7.id,
      },
      {
        name: 'Dim Sum Mixto',
        description: '6 piezas de dim sum variado',
        price: 11.99,
        image: 'https://images.unsplash.com/photo-1563379091339-03246963d96a?w=400',
        category: 'Dim Sum',
        restaurantId: restaurant7.id,
      },
      {
        name: 'Arroz Frito',
        description: 'Arroz frito con huevo y vegetales',
        price: 9.99,
        image: 'https://images.unsplash.com/photo-1563379091339-03246963d96a?w=400',
        category: 'Platos Principales',
        restaurantId: restaurant7.id,
      },
      {
        name: 'Té de Oolong',
        description: 'Té chino tradicional',
        price: 3.99,
        image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400',
        category: 'Bebidas',
        restaurantId: restaurant7.id,
      },
      {
        name: 'Bubble Tea',
        description: 'Té con leche y perlas de tapioca',
        price: 5.99,
        image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400',
        category: 'Bebidas',
        restaurantId: restaurant7.id,
      },
      {
        name: 'Pastel de Luna',
        description: 'Pastel tradicional chino con pasta de frijol',
        price: 6.99,
        image: 'https://images.unsplash.com/photo-1606312619070-d48b4e55dc5f?w=400',
        category: 'Postres',
        restaurantId: restaurant7.id,
      },
    ],
  });

  // Taquería Los Amigos - Tacos, Burritos, Bebidas, Postres
  await prisma.product.createMany({
    data: [
      {
        name: 'Burrito de Carne Asada',
        description: 'Burrito grande con carne asada, frijoles y arroz',
        price: 10.99,
        image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400',
        category: 'Burritos',
        restaurantId: restaurant8.id,
      },
      {
        name: 'Burrito de Pollo',
        description: 'Burrito grande con pollo, frijoles y arroz',
        price: 9.99,
        image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400',
        category: 'Burritos',
        restaurantId: restaurant8.id,
      },
      {
        name: 'Tacos de Carnitas',
        description: '3 tacos de carnitas con cebolla y cilantro',
        price: 8.99,
        image: 'https://images.unsplash.com/photo-1565299585323-38174c3d6c6e?w=400',
        category: 'Tacos',
        restaurantId: restaurant8.id,
      },
      {
        name: 'Quesadilla Grande',
        description: 'Quesadilla grande con queso y carne',
        price: 7.99,
        image: 'https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=400',
        category: 'Antojitos',
        restaurantId: restaurant8.id,
      },
      {
        name: 'Agua de Tamarindo',
        description: 'Agua fresca de tamarindo',
        price: 3.99,
        image: 'https://images.unsplash.com/photo-1523677011781-c91d1bbe2fdc?w=400',
        category: 'Bebidas',
        restaurantId: restaurant8.id,
      },
      {
        name: 'Michelada',
        description: 'Cerveza con limón, sal y salsas',
        price: 6.99,
        image: 'https://images.unsplash.com/photo-1506377247727-4b5f3a0c714a?w=400',
        category: 'Bebidas',
        restaurantId: restaurant8.id,
      },
      {
        name: 'Churros con Chocolate',
        description: 'Churros recién hechos con chocolate caliente',
        price: 5.99,
        image: 'https://images.unsplash.com/photo-1606312619070-d48b4e55dc5f?w=400',
        category: 'Postres',
        restaurantId: restaurant8.id,
      },
    ],
  });

  // Thai Garden - Platos Principales, Bebidas, Postres
  await prisma.product.createMany({
    data: [
      {
        name: 'Pad Thai',
        description: 'Fideos de arroz salteados con camarones y vegetales',
        price: 15.99,
        image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400',
        category: 'Platos Principales',
        restaurantId: restaurant9.id,
      },
      {
        name: 'Curry Rojo de Pollo',
        description: 'Curry tailandés con pollo y leche de coco',
        price: 16.99,
        image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400',
        category: 'Curries',
        restaurantId: restaurant9.id,
      },
      {
        name: 'Tom Yum Goong',
        description: 'Sopa agridulce con camarones y hierbas',
        price: 14.99,
        image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400',
        category: 'Sopas',
        restaurantId: restaurant9.id,
      },
      {
        name: 'Som Tam',
        description: 'Ensalada de papaya verde con cacahuates',
        price: 9.99,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
        category: 'Ensaladas',
        restaurantId: restaurant9.id,
      },
      {
        name: 'Té de Hierbas Tailandés',
        description: 'Té tradicional tailandés con hierbas',
        price: 3.99,
        image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400',
        category: 'Bebidas',
        restaurantId: restaurant9.id,
      },
      {
        name: 'Coco Fresco',
        description: 'Agua de coco natural',
        price: 4.99,
        image: 'https://images.unsplash.com/photo-1523677011781-c91d1bbe2fdc?w=400',
        category: 'Bebidas',
        restaurantId: restaurant9.id,
      },
      {
        name: 'Mango Sticky Rice',
        description: 'Arroz glutinoso con mango y leche de coco',
        price: 7.99,
        image: 'https://images.unsplash.com/photo-1606312619070-d48b4e55dc5f?w=400',
        category: 'Postres',
        restaurantId: restaurant9.id,
      },
    ],
  });

  // Mediterranean Breeze - Platos Principales, Bebidas, Postres
  await prisma.product.createMany({
    data: [
      {
        name: 'Gyros de Pollo',
        description: 'Gyros con pollo, tzatziki y vegetales',
        price: 12.99,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
        category: 'Platos Principales',
        restaurantId: restaurant10.id,
      },
      {
        name: 'Falafel Plate',
        description: 'Falafel con hummus, tahini y ensalada',
        price: 11.99,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
        category: 'Platos Principales',
        restaurantId: restaurant10.id,
      },
      {
        name: 'Hummus con Pita',
        description: 'Hummus casero con pan pita',
        price: 7.99,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
        category: 'Acompañamientos',
        restaurantId: restaurant10.id,
      },
      {
        name: 'Moussaka',
        description: 'Pastel de berenjena, carne y bechamel',
        price: 14.99,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
        category: 'Platos Principales',
        restaurantId: restaurant10.id,
      },
      {
        name: 'Agua de Rosas',
        description: 'Bebida refrescante con agua de rosas',
        price: 4.99,
        image: 'https://images.unsplash.com/photo-1523677011781-c91d1bbe2fdc?w=400',
        category: 'Bebidas',
        restaurantId: restaurant10.id,
      },
      {
        name: 'Baklava',
        description: 'Pastel de hojaldre con nueces y miel',
        price: 6.99,
        image: 'https://images.unsplash.com/photo-1606312619070-d48b4e55dc5f?w=400',
        category: 'Postres',
        restaurantId: restaurant10.id,
      },
      {
        name: 'Kunefe',
        description: 'Postre de queso y sémola con almíbar',
        price: 7.99,
        image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400',
        category: 'Postres',
        restaurantId: restaurant10.id,
      },
    ],
  });

  // Le Bistro Français - Platos Principales, Bebidas, Postres
  await prisma.product.createMany({
    data: [
      {
        name: 'Coq au Vin',
        description: 'Pollo cocido en vino tinto con vegetales',
        price: 22.99,
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
        category: 'Platos Principales',
        restaurantId: restaurant11.id,
      },
      {
        name: 'Ratatouille',
        description: 'Guiso de vegetales provenzales',
        price: 16.99,
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
        category: 'Platos Principales',
        restaurantId: restaurant11.id,
      },
      {
        name: 'Croissant Artesanal',
        description: 'Croissant francés recién horneado',
        price: 4.99,
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400',
        category: 'Acompañamientos',
        restaurantId: restaurant11.id,
      },
      {
        name: 'Bouillabaisse',
        description: 'Sopa de pescado provenzal',
        price: 24.99,
        image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400',
        category: 'Sopas',
        restaurantId: restaurant11.id,
      },
      {
        name: 'Vino Tinto Francés',
        description: 'Vino tinto de Borgoña',
        price: 18.99,
        image: 'https://images.unsplash.com/photo-1506377247727-4b5f3a0c714a?w=400',
        category: 'Bebidas',
        restaurantId: restaurant11.id,
      },
      {
        name: 'Café au Lait',
        description: 'Café con leche al estilo francés',
        price: 4.99,
        image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400',
        category: 'Bebidas',
        restaurantId: restaurant11.id,
      },
      {
        name: 'Crème Brûlée',
        description: 'Postre de crema quemada',
        price: 8.99,
        image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400',
        category: 'Postres',
        restaurantId: restaurant11.id,
      },
      {
        name: 'Macarons (6 piezas)',
        description: 'Macarons franceses de diferentes sabores',
        price: 12.99,
        image: 'https://images.unsplash.com/photo-1606312619070-d48b4e55dc5f?w=400',
        category: 'Postres',
        restaurantId: restaurant11.id,
      },
    ],
  });

  // BBQ Smokehouse - Platos Principales, Acompañamientos, Bebidas, Postres
  await prisma.product.createMany({
    data: [
      {
        name: 'Costillas BBQ',
        description: 'Costillas de cerdo ahumadas con salsa BBQ',
        price: 19.99,
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400',
        category: 'Platos Principales',
        restaurantId: restaurant12.id,
      },
      {
        name: 'Pulled Pork',
        description: 'Cerdo desmenuzado ahumado lentamente',
        price: 16.99,
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400',
        category: 'Platos Principales',
        restaurantId: restaurant12.id,
      },
      {
        name: 'Brisket',
        description: 'Pechuga de res ahumada lentamente',
        price: 21.99,
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400',
        category: 'Platos Principales',
        restaurantId: restaurant12.id,
      },
      {
        name: 'Coleslaw',
        description: 'Ensalada de col con aderezo cremoso',
        price: 4.99,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
        category: 'Acompañamientos',
        restaurantId: restaurant12.id,
      },
      {
        name: 'Cornbread',
        description: 'Pan de maíz casero',
        price: 3.99,
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400',
        category: 'Acompañamientos',
        restaurantId: restaurant12.id,
      },
      {
        name: 'Limonada de Fresa',
        description: 'Limonada fresca con fresas',
        price: 4.99,
        image: 'https://images.unsplash.com/photo-1523677011781-c91d1bbe2fdc?w=400',
        category: 'Bebidas',
        restaurantId: restaurant12.id,
      },
      {
        name: 'Cerveza Artesanal',
        description: 'Cerveza local artesanal',
        price: 5.99,
        image: 'https://images.unsplash.com/photo-1506377247727-4b5f3a0c714a?w=400',
        category: 'Bebidas',
        restaurantId: restaurant12.id,
      },
      {
        name: 'Pecan Pie',
        description: 'Pastel de nuez pecan con caramelo',
        price: 7.99,
        image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400',
        category: 'Postres',
        restaurantId: restaurant12.id,
      },
      {
        name: 'Key Lime Pie',
        description: 'Pastel de lima con merengue',
        price: 6.99,
        image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400',
        category: 'Postres',
        restaurantId: restaurant12.id,
      },
    ],
  });

  // Seoul BBQ (Coreana) - Platos Principales, Guarniciones, Bebidas
  await prisma.product.createMany({
    data: [
      {
        name: 'Bulgogi',
        description: 'Carne de res marinada en salsa de soja y ajo, asada a la parrilla',
        price: 18.99,
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80&fit=crop',
        category: 'Platos Principales',
        restaurantId: restaurant13.id,
      },
      {
        name: 'Galbi',
        description: 'Costillas de res marinadas estilo coreano, asadas a la perfección',
        price: 22.99,
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80&fit=crop',
        category: 'Platos Principales',
        restaurantId: restaurant13.id,
      },
      {
        name: 'Bibimbap',
        description: 'Arroz con vegetales, carne y huevo, servido en bowl de piedra caliente',
        price: 16.99,
        image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80&fit=crop',
        category: 'Platos Principales',
        restaurantId: restaurant13.id,
      },
      {
        name: 'Kimchi',
        description: 'Repollo fermentado picante, acompañamiento tradicional coreano',
        price: 4.99,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80&fit=crop',
        category: 'Guarniciones',
        restaurantId: restaurant13.id,
      },
      {
        name: 'Japchae',
        description: 'Fideos de batata salteados con vegetales y carne',
        price: 14.99,
        image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80&fit=crop',
        category: 'Platos Principales',
        restaurantId: restaurant13.id,
      },
      {
        name: 'Soju',
        description: 'Bebida alcohólica coreana tradicional',
        price: 8.99,
        image: 'https://images.unsplash.com/photo-1506377247727-4b5f3a0c714a?w=400&q=80&fit=crop',
        category: 'Bebidas',
        restaurantId: restaurant13.id,
      },
    ],
  });

  // Pho Saigon (Vietnamita) - Sopas, Platos Principales, Bebidas
  await prisma.product.createMany({
    data: [
      {
        name: 'Pho Bo',
        description: 'Sopa de fideos con carne de res, hierbas frescas y caldo aromático',
        price: 12.99,
        image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400&q=80&fit=crop',
        category: 'Sopas',
        restaurantId: restaurant14.id,
      },
      {
        name: 'Pho Ga',
        description: 'Sopa de fideos con pollo, cebollas verdes y cilantro',
        price: 11.99,
        image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400&q=80&fit=crop',
        category: 'Sopas',
        restaurantId: restaurant14.id,
      },
      {
        name: 'Banh Mi',
        description: 'Sandwich vietnamita con cerdo, encurtidos y cilantro',
        price: 8.99,
        image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&q=80&fit=crop',
        category: 'Platos Principales',
        restaurantId: restaurant14.id,
      },
      {
        name: 'Rollitos Primavera',
        description: 'Rollitos frescos de vegetales y camarones con salsa de maní',
        price: 7.99,
        image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80&fit=crop',
        category: 'Aperitivos',
        restaurantId: restaurant14.id,
      },
      {
        name: 'Bun Cha',
        description: 'Fideos de arroz con cerdo a la parrilla y hierbas frescas',
        price: 13.99,
        image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80&fit=crop',
        category: 'Platos Principales',
        restaurantId: restaurant14.id,
      },
      {
        name: 'Café Vietnamita',
        description: 'Café fuerte con leche condensada, estilo vietnamita',
        price: 4.99,
        image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&q=80&fit=crop',
        category: 'Bebidas',
        restaurantId: restaurant14.id,
      },
    ],
  });

  // Churrascaria Brasil (Brasileña) - Carnes, Platos Principales, Bebidas
  await prisma.product.createMany({
    data: [
      {
        name: 'Picanha',
        description: 'Corte premium de res brasileño, asado a la parrilla',
        price: 28.99,
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80&fit=crop',
        category: 'Carnes',
        restaurantId: restaurant15.id,
      },
      {
        name: 'Feijoada',
        description: 'Guiso tradicional brasileño con frijoles negros y carnes',
        price: 19.99,
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80&fit=crop',
        category: 'Platos Principales',
        restaurantId: restaurant15.id,
      },
      {
        name: 'Coxinha',
        description: 'Croquetas de pollo rellenas, empanadas y fritas',
        price: 6.99,
        image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&q=80&fit=crop',
        category: 'Aperitivos',
        restaurantId: restaurant15.id,
      },
      {
        name: 'Moqueca de Peixe',
        description: 'Guiso de pescado con leche de coco y dendê',
        price: 22.99,
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80&fit=crop',
        category: 'Platos Principales',
        restaurantId: restaurant15.id,
      },
      {
        name: 'Caipirinha',
        description: 'Cóctel brasileño con cachaça, lima y azúcar',
        price: 9.99,
        image: 'https://images.unsplash.com/photo-1523677011781-c91d1bbe2fdc?w=400&q=80&fit=crop',
        category: 'Bebidas',
        restaurantId: restaurant15.id,
      },
      {
        name: 'Brigadeiro',
        description: 'Dulce brasileño de chocolate y leche condensada',
        price: 5.99,
        image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=80&fit=crop',
        category: 'Postres',
        restaurantId: restaurant15.id,
      },
    ],
  });

  // Cevichería El Peruano (Peruana) - Ceviches, Platos Principales, Bebidas
  await prisma.product.createMany({
    data: [
      {
        name: 'Ceviche de Pescado',
        description: 'Pescado fresco marinado en limón, ají y cilantro',
        price: 16.99,
        image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&q=80&fit=crop',
        category: 'Ceviches',
        restaurantId: restaurant16.id,
      },
      {
        name: 'Ceviche de Camarones',
        description: 'Camarones frescos en leche de tigre con ají amarillo',
        price: 18.99,
        image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&q=80&fit=crop',
        category: 'Ceviches',
        restaurantId: restaurant16.id,
      },
      {
        name: 'Lomo Saltado',
        description: 'Carne salteada con papas fritas, tomate y arroz',
        price: 19.99,
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80&fit=crop',
        category: 'Platos Principales',
        restaurantId: restaurant16.id,
      },
      {
        name: 'Aji de Gallina',
        description: 'Pollo desmenuzado en salsa cremosa de ají amarillo',
        price: 17.99,
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80&fit=crop',
        category: 'Platos Principales',
        restaurantId: restaurant16.id,
      },
      {
        name: 'Anticuchos',
        description: 'Brochetas de corazón de res marinadas y asadas',
        price: 12.99,
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80&fit=crop',
        category: 'Platos Principales',
        restaurantId: restaurant16.id,
      },
      {
        name: 'Chicha Morada',
        description: 'Bebida peruana de maíz morado con especias',
        price: 4.99,
        image: 'https://images.unsplash.com/photo-1523677011781-c91d1bbe2fdc?w=400&q=80&fit=crop',
        category: 'Bebidas',
        restaurantId: restaurant16.id,
      },
    ],
  });

  // La Taberna Española (Española) - Tapas, Paella, Bebidas
  await prisma.product.createMany({
    data: [
      {
        name: 'Paella Valenciana',
        description: 'Arroz con pollo, conejo, judías verdes y azafrán',
        price: 24.99,
        image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&q=80&fit=crop',
        category: 'Platos Principales',
        restaurantId: restaurant17.id,
      },
      {
        name: 'Paella de Mariscos',
        description: 'Arroz con mariscos frescos y azafrán',
        price: 26.99,
        image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&q=80&fit=crop',
        category: 'Platos Principales',
        restaurantId: restaurant17.id,
      },
      {
        name: 'Jamón Ibérico',
        description: 'Jamón ibérico de bellota, cortado a mano',
        price: 18.99,
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80&fit=crop',
        category: 'Tapas',
        restaurantId: restaurant17.id,
      },
      {
        name: 'Tortilla Española',
        description: 'Tortilla de patatas tradicional española',
        price: 8.99,
        image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&q=80&fit=crop',
        category: 'Tapas',
        restaurantId: restaurant17.id,
      },
      {
        name: 'Gambas al Ajillo',
        description: 'Camarones al ajillo con aceite de oliva',
        price: 12.99,
        image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&q=80&fit=crop',
        category: 'Tapas',
        restaurantId: restaurant17.id,
      },
      {
        name: 'Sangría',
        description: 'Vino tinto con frutas y especias',
        price: 9.99,
        image: 'https://images.unsplash.com/photo-1506377247727-4b5f3a0c714a?w=400&q=80&fit=crop',
        category: 'Bebidas',
        restaurantId: restaurant17.id,
      },
    ],
  });

  // Istanbul Kebab (Turca) - Kebabs, Platos Principales, Postres
  await prisma.product.createMany({
    data: [
      {
        name: 'Doner Kebab',
        description: 'Carne de cordero asada en espetón, servida en pan pita',
        price: 11.99,
        image: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=400&q=80&fit=crop',
        category: 'Kebabs',
        restaurantId: restaurant18.id,
      },
      {
        name: 'Shish Kebab',
        description: 'Brochetas de cordero marinado y asado',
        price: 13.99,
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80&fit=crop',
        category: 'Kebabs',
        restaurantId: restaurant18.id,
      },
      {
        name: 'Lahmacun',
        description: 'Pizza turca fina con carne picada y especias',
        price: 7.99,
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80&fit=crop',
        category: 'Platos Principales',
        restaurantId: restaurant18.id,
      },
      {
        name: 'Baklava',
        description: 'Pastel de hojaldre con nueces y miel',
        price: 6.99,
        image: 'https://images.unsplash.com/photo-1606312619070-d48b4e55dc5f?w=400&q=80&fit=crop',
        category: 'Postres',
        restaurantId: restaurant18.id,
      },
      {
        name: 'Ayran',
        description: 'Bebida de yogur salada tradicional turca',
        price: 3.99,
        image: 'https://images.unsplash.com/photo-1523677011781-c91d1bbe2fdc?w=400&q=80&fit=crop',
        category: 'Bebidas',
        restaurantId: restaurant18.id,
      },
      {
        name: 'Meze Platter',
        description: 'Selección de entradas: hummus, baba ganoush, tabbouleh',
        price: 14.99,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80&fit=crop',
        category: 'Aperitivos',
        restaurantId: restaurant18.id,
      },
    ],
  });

  // Biergarten (Alemana) - Platos Principales, Bebidas, Postres
  await prisma.product.createMany({
    data: [
      {
        name: 'Schnitzel',
        description: 'Milanesa de cerdo empanizada, estilo alemán',
        price: 16.99,
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80&fit=crop',
        category: 'Platos Principales',
        restaurantId: restaurant19.id,
      },
      {
        name: 'Bratwurst',
        description: 'Salchicha alemana con chucrut y mostaza',
        price: 12.99,
        image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&q=80&fit=crop',
        category: 'Platos Principales',
        restaurantId: restaurant19.id,
      },
      {
        name: 'Sauerbraten',
        description: 'Carne de res marinada en vinagre, estofada lentamente',
        price: 19.99,
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80&fit=crop',
        category: 'Platos Principales',
        restaurantId: restaurant19.id,
      },
      {
        name: 'Cerveza Alemana',
        description: 'Cerveza artesanal estilo bávaro',
        price: 6.99,
        image: 'https://images.unsplash.com/photo-1506377247727-4b5f3a0c714a?w=400&q=80&fit=crop',
        category: 'Bebidas',
        restaurantId: restaurant19.id,
      },
      {
        name: 'Pretzel',
        description: 'Brezel alemán grande con sal gruesa',
        price: 5.99,
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80&fit=crop',
        category: 'Aperitivos',
        restaurantId: restaurant19.id,
      },
      {
        name: 'Apfelstrudel',
        description: 'Strudel de manzana con canela y pasas',
        price: 7.99,
        image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=80&fit=crop',
        category: 'Postres',
        restaurantId: restaurant19.id,
      },
    ],
  });

  // El Asador Argentino (Argentina) - Carnes, Platos Principales, Bebidas
  await prisma.product.createMany({
    data: [
      {
        name: 'Asado de Tira',
        description: 'Costillas de res asadas a la parrilla argentina',
        price: 24.99,
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80&fit=crop',
        category: 'Carnes',
        restaurantId: restaurant20.id,
      },
      {
        name: 'Bife de Chorizo',
        description: 'Corte premium de res, asado a la perfección',
        price: 26.99,
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80&fit=crop',
        category: 'Carnes',
        restaurantId: restaurant20.id,
      },
      {
        name: 'Empanadas Argentinas',
        description: 'Empanadas de carne, pollo o jamón y queso',
        price: 8.99,
        image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&q=80&fit=crop',
        category: 'Aperitivos',
        restaurantId: restaurant20.id,
      },
      {
        name: 'Chimichurri',
        description: 'Salsa argentina de perejil, ajo y aceite',
        price: 2.99,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80&fit=crop',
        category: 'Guarniciones',
        restaurantId: restaurant20.id,
      },
      {
        name: 'Provoleta',
        description: 'Queso provolone a la parrilla con orégano',
        price: 9.99,
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80&fit=crop',
        category: 'Aperitivos',
        restaurantId: restaurant20.id,
      },
      {
        name: 'Malbec',
        description: 'Vino tinto argentino de la mejor calidad',
        price: 15.99,
        image: 'https://images.unsplash.com/photo-1506377247727-4b5f3a0c714a?w=400&q=80&fit=crop',
        category: 'Bebidas',
        restaurantId: restaurant20.id,
      },
    ],
  });

  // Aladdin's Kitchen (Libanesa) - Platos Principales, Mezze, Bebidas
  await prisma.product.createMany({
    data: [
      {
        name: 'Shawarma de Pollo',
        description: 'Pollo marinado asado en espetón, servido en pan pita',
        price: 11.99,
        image: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=400&q=80&fit=crop',
        category: 'Platos Principales',
        restaurantId: restaurant21.id,
      },
      {
        name: 'Hummus',
        description: 'Puré de garbanzos con tahini y aceite de oliva',
        price: 6.99,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80&fit=crop',
        category: 'Mezze',
        restaurantId: restaurant21.id,
      },
      {
        name: 'Falafel',
        description: 'Croquetas de garbanzos fritas, servidas con tahini',
        price: 7.99,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80&fit=crop',
        category: 'Mezze',
        restaurantId: restaurant21.id,
      },
      {
        name: 'Tabbouleh',
        description: 'Ensalada de perejil, tomate, bulgur y limón',
        price: 6.99,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80&fit=crop',
        category: 'Mezze',
        restaurantId: restaurant21.id,
      },
      {
        name: 'Kafta',
        description: 'Carne picada con especias, asada a la parrilla',
        price: 14.99,
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80&fit=crop',
        category: 'Platos Principales',
        restaurantId: restaurant21.id,
      },
      {
        name: 'Baklava',
        description: 'Pastel de hojaldre con nueces y miel',
        price: 6.99,
        image: 'https://images.unsplash.com/photo-1606312619070-d48b4e55dc5f?w=400&q=80&fit=crop',
        category: 'Postres',
        restaurantId: restaurant21.id,
      },
    ],
  });

  // Abyssinia (Etiope) - Platos Principales, Guarniciones, Bebidas
  await prisma.product.createMany({
    data: [
      {
        name: 'Doro Wat',
        description: 'Guiso de pollo picante con huevo duro y injera',
        price: 17.99,
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80&fit=crop',
        category: 'Platos Principales',
        restaurantId: restaurant22.id,
      },
      {
        name: 'Tibs',
        description: 'Carne salteada con cebolla, pimientos y especias',
        price: 19.99,
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80&fit=crop',
        category: 'Platos Principales',
        restaurantId: restaurant22.id,
      },
      {
        name: 'Injera',
        description: 'Pan etíope esponjoso de teff, base de todos los platos',
        price: 3.99,
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80&fit=crop',
        category: 'Guarniciones',
        restaurantId: restaurant22.id,
      },
      {
        name: 'Misir Wat',
        description: 'Guiso de lentejas rojas con berbere',
        price: 12.99,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80&fit=crop',
        category: 'Platos Principales',
        restaurantId: restaurant22.id,
      },
      {
        name: 'Shiro',
        description: 'Guiso cremoso de garbanzos con especias',
        price: 11.99,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80&fit=crop',
        category: 'Platos Principales',
        restaurantId: restaurant22.id,
      },
      {
        name: 'Tej',
        description: 'Bebida etíope de miel fermentada',
        price: 7.99,
        image: 'https://images.unsplash.com/photo-1523677011781-c91d1bbe2fdc?w=400&q=80&fit=crop',
        category: 'Bebidas',
        restaurantId: restaurant22.id,
      },
    ],
  });

  // Marrakech Express (Marroquí) - Tagines, Couscous, Bebidas
  await prisma.product.createMany({
    data: [
      {
        name: 'Tagine de Cordero',
        description: 'Cordero cocido lentamente con ciruelas y almendras',
        price: 20.99,
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80&fit=crop',
        category: 'Tagine',
        restaurantId: restaurant23.id,
      },
      {
        name: 'Tagine de Pollo',
        description: 'Pollo con limón confitado y aceitunas',
        price: 18.99,
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80&fit=crop',
        category: 'Tagine',
        restaurantId: restaurant23.id,
      },
      {
        name: 'Couscous Real',
        description: 'Couscous con cordero, verduras y garbanzos',
        price: 19.99,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80&fit=crop',
        category: 'Platos Principales',
        restaurantId: restaurant23.id,
      },
      {
        name: 'Pastela',
        description: 'Pastel salado de pollo con almendras y especias',
        price: 16.99,
        image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&q=80&fit=crop',
        category: 'Platos Principales',
        restaurantId: restaurant23.id,
      },
      {
        name: 'Harira',
        description: 'Sopa tradicional marroquí de lentejas y tomate',
        price: 9.99,
        image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400&q=80&fit=crop',
        category: 'Sopas',
        restaurantId: restaurant23.id,
      },
      {
        name: 'Té de Menta',
        description: 'Té verde con menta fresca, tradicional marroquí',
        price: 3.99,
        image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80&fit=crop',
        category: 'Bebidas',
        restaurantId: restaurant23.id,
      },
    ],
  });

  // Opa! Greek Taverna (Griega) - Platos Principales, Mezze, Bebidas
  await prisma.product.createMany({
    data: [
      {
        name: 'Souvlaki',
        description: 'Brochetas de pollo o cerdo con pita y tzatziki',
        price: 13.99,
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80&fit=crop',
        category: 'Platos Principales',
        restaurantId: restaurant24.id,
      },
      {
        name: 'Moussaka',
        description: 'Pastel de berenjena, carne y bechamel',
        price: 16.99,
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80&fit=crop',
        category: 'Platos Principales',
        restaurantId: restaurant24.id,
      },
      {
        name: 'Gyros',
        description: 'Carne asada en espetón, servida en pita con tzatziki',
        price: 11.99,
        image: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=400&q=80&fit=crop',
        category: 'Platos Principales',
        restaurantId: restaurant24.id,
      },
      {
        name: 'Spanakopita',
        description: 'Pastel de espinaca y queso feta en hojaldre',
        price: 8.99,
        image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&q=80&fit=crop',
        category: 'Mezze',
        restaurantId: restaurant24.id,
      },
      {
        name: 'Tzatziki',
        description: 'Salsa de yogur con pepino y ajo',
        price: 4.99,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80&fit=crop',
        category: 'Mezze',
        restaurantId: restaurant24.id,
      },
      {
        name: 'Baklava',
        description: 'Pastel de hojaldre con nueces y miel',
        price: 6.99,
        image: 'https://images.unsplash.com/photo-1606312619070-d48b4e55dc5f?w=400&q=80&fit=crop',
        category: 'Postres',
        restaurantId: restaurant24.id,
      },
    ],
  });

  console.log('✅ Productos creados');
  console.log('🎉 Seed completado exitosamente!');
  console.log(`📊 Total: ${await prisma.restaurant.count()} restaurantes`);
  console.log(`📊 Total: ${await prisma.product.count()} productos`);
}

main()
  .catch((e) => {
    console.error('❌ Error en el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
