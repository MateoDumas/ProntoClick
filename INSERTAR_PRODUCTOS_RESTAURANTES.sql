-- Insertar productos típicos para cada restaurante
-- Platos principales, bebidas y postres de cada cultura

-- BRASIL 🇧🇷 - Feijoada do Brasil
INSERT INTO "Product" (id, name, description, price, image, category, "restaurantId", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Feijoada Completa',
  'Feijoada tradicional con frijoles negros, carne de cerdo, chorizo, acompañada de arroz, farofa, couve y naranja',
  18.00,
  'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800',
  'Plato',
  r.id,
  NOW(),
  NOW()
FROM "Restaurant" r WHERE r.name = 'Feijoada do Brasil';

INSERT INTO "Product" (id, name, description, price, image, category, "restaurantId", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Picanha na Chapa',
  'Picanha brasileña a la parrilla con arroz, frijoles y farofa',
  22.00,
  'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
  'Plato',
  r.id,
  NOW(),
  NOW()
FROM "Restaurant" r WHERE r.name = 'Feijoada do Brasil';

INSERT INTO "Product" (id, name, description, price, image, category, "restaurantId", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Caipirinha',
  'Bebida típica brasileña con cachaça, lima y azúcar',
  8.00,
  'https://images.unsplash.com/photo-1551538827-9c0370b36079?w=800',
  'Bebida',
  r.id,
  NOW(),
  NOW()
FROM "Restaurant" r WHERE r.name = 'Feijoada do Brasil';

INSERT INTO "Product" (id, name, description, price, image, category, "restaurantId", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Brigadeiro',
  'Postre brasileño de chocolate con leche condensada y granulado',
  5.00,
  'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800',
  'Postre',
  r.id,
  NOW(),
  NOW()
FROM "Restaurant" r WHERE r.name = 'Feijoada do Brasil';

-- ARGENTINA 🇦🇷 - Parrilla Argentina
INSERT INTO "Product" (id, name, description, price, image, category, "restaurantId", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Asado de Tira',
  'Costillas de res a la parrilla con chimichurri casero, ensalada y papas',
  28.00,
  'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
  'Plato',
  r.id,
  NOW(),
  NOW()
FROM "Restaurant" r WHERE r.name = 'Parrilla Argentina';

INSERT INTO "Product" (id, name, description, price, image, category, "restaurantId", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Empanadas Criollas',
  'Empanadas de carne cortada a cuchillo con cebolla, huevo y aceitunas',
  12.00,
  'https://images.unsplash.com/photo-1565299585323-38174c3d6c6e?w=800',
  'Plato',
  r.id,
  NOW(),
  NOW()
FROM "Restaurant" r WHERE r.name = 'Parrilla Argentina';

INSERT INTO "Product" (id, name, description, price, image, category, "restaurantId", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Malbec',
  'Vino tinto argentino Malbec de Mendoza',
  15.00,
  'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800',
  'Bebida',
  r.id,
  NOW(),
  NOW()
FROM "Restaurant" r WHERE r.name = 'Parrilla Argentina';

INSERT INTO "Product" (id, name, description, price, image, category, "restaurantId", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Dulce de Leche con Panqueques',
  'Panqueques rellenos de dulce de leche argentino',
  9.00,
  'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800',
  'Postre',
  r.id,
  NOW(),
  NOW()
FROM "Restaurant" r WHERE r.name = 'Parrilla Argentina';

-- PERÚ 🇵🇪 - Cevichería El Pescador
INSERT INTO "Product" (id, name, description, price, image, category, "restaurantId", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Ceviche de Pescado',
  'Ceviche fresco con pescado del día, cebolla, ají limo, cilantro y leche de tigre',
  20.00,
  'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800',
  'Plato',
  r.id,
  NOW(),
  NOW()
FROM "Restaurant" r WHERE r.name = 'Cevichería El Pescador';

INSERT INTO "Product" (id, name, description, price, image, category, "restaurantId", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Lomo Saltado',
  'Lomo saltado tradicional con papas fritas y arroz',
  18.00,
  'https://images.unsplash.com/photo-1558030006-450675393462?w=800',
  'Plato',
  r.id,
  NOW(),
  NOW()
FROM "Restaurant" r WHERE r.name = 'Cevichería El Pescador';

INSERT INTO "Product" (id, name, description, price, image, category, "restaurantId", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Chicha Morada',
  'Bebida peruana de maíz morado con canela y clavo',
  6.00,
  'https://images.unsplash.com/photo-1551538827-9c0370b36079?w=800',
  'Bebida',
  r.id,
  NOW(),
  NOW()
FROM "Restaurant" r WHERE r.name = 'Cevichería El Pescador';

INSERT INTO "Product" (id, name, description, price, image, category, "restaurantId", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Suspiro Limeño',
  'Postre peruano de manjar blanco con merengue italiano',
  8.00,
  'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800',
  'Postre',
  r.id,
  NOW(),
  NOW()
FROM "Restaurant" r WHERE r.name = 'Cevichería El Pescador';

-- ESPAÑA 🇪🇸 - Paella Valenciana
INSERT INTO "Product" (id, name, description, price, image, category, "restaurantId", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Paella de Mariscos',
  'Paella valenciana auténtica con arroz, mariscos frescos, azafrán y verduras',
  32.00,
  'https://images.unsplash.com/photo-1558030006-450675393462?w=800',
  'Plato',
  r.id,
  NOW(),
  NOW()
FROM "Restaurant" r WHERE r.name = 'Paella Valenciana';

INSERT INTO "Product" (id, name, description, price, image, category, "restaurantId", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Tortilla Española',
  'Tortilla de patatas tradicional española con cebolla',
  14.00,
  'https://images.unsplash.com/photo-1565299585323-38174c3d6c6e?w=800',
  'Plato',
  r.id,
  NOW(),
  NOW()
FROM "Restaurant" r WHERE r.name = 'Paella Valenciana';

INSERT INTO "Product" (id, name, description, price, image, category, "restaurantId", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Sangría',
  'Sangría española con vino tinto, frutas y especias',
  12.00,
  'https://images.unsplash.com/photo-1551538827-9c0370b36079?w=800',
  'Bebida',
  r.id,
  NOW(),
  NOW()
FROM "Restaurant" r WHERE r.name = 'Paella Valenciana';

INSERT INTO "Product" (id, name, description, price, image, category, "restaurantId", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Flan de Huevo',
  'Flan casero español con caramelo',
  7.00,
  'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800',
  'Postre',
  r.id,
  NOW(),
  NOW()
FROM "Restaurant" r WHERE r.name = 'Paella Valenciana';

-- TURQUÍA 🇹🇷 - Kebab Istanbul
INSERT INTO "Product" (id, name, description, price, image, category, "restaurantId", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Döner Kebab',
  'Kebab de cordero con pan pita, lechuga, tomate, cebolla y salsa especial',
  16.00,
  'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=800',
  'Plato',
  r.id,
  NOW(),
  NOW()
FROM "Restaurant" r WHERE r.name = 'Kebab Istanbul';

INSERT INTO "Product" (id, name, description, price, image, category, "restaurantId", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Lahmacun',
  'Pizza turca con carne picada, cebolla, tomate y especias',
  12.00,
  'https://images.unsplash.com/photo-1565299585323-38174c3d6c6e?w=800',
  'Plato',
  r.id,
  NOW(),
  NOW()
FROM "Restaurant" r WHERE r.name = 'Kebab Istanbul';

INSERT INTO "Product" (id, name, description, price, image, category, "restaurantId", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Ayran',
  'Bebida turca de yogur salado y agua',
  4.00,
  'https://images.unsplash.com/photo-1551538827-9c0370b36079?w=800',
  'Bebida',
  r.id,
  NOW(),
  NOW()
FROM "Restaurant" r WHERE r.name = 'Kebab Istanbul';

INSERT INTO "Product" (id, name, description, price, image, category, "restaurantId", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Baklava',
  'Postre turco de hojaldre con pistachos y miel',
  8.00,
  'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800',
  'Postre',
  r.id,
  NOW(),
  NOW()
FROM "Restaurant" r WHERE r.name = 'Kebab Istanbul';

-- COLOMBIA 🇨🇴 - Bandeja Paisa
INSERT INTO "Product" (id, name, description, price, image, category, "restaurantId", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Bandeja Paisa Completa',
  'Frijoles, arroz, chicharrón, huevo frito, aguacate, chorizo, arepa y plátano maduro',
  22.00,
  'https://images.unsplash.com/photo-1558030006-450675393462?w=800',
  'Plato',
  r.id,
  NOW(),
  NOW()
FROM "Restaurant" r WHERE r.name = 'Bandeja Paisa';

INSERT INTO "Product" (id, name, description, price, image, category, "restaurantId", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Arepa Rellena',
  'Arepa de maíz rellena con carne desmechada, queso y aguacate',
  10.00,
  'https://images.unsplash.com/photo-1565299585323-38174c3d6c6e?w=800',
  'Plato',
  r.id,
  NOW(),
  NOW()
FROM "Restaurant" r WHERE r.name = 'Bandeja Paisa';

INSERT INTO "Product" (id, name, description, price, image, category, "restaurantId", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Jugo de Lulo',
  'Jugo natural de lulo colombiano',
  5.00,
  'https://images.unsplash.com/photo-1551538827-9c0370b36079?w=800',
  'Bebida',
  r.id,
  NOW(),
  NOW()
FROM "Restaurant" r WHERE r.name = 'Bandeja Paisa';

INSERT INTO "Product" (id, name, description, price, image, category, "restaurantId", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Arequipe con Queso',
  'Postre colombiano de arequipe (dulce de leche) con queso fresco',
  7.00,
  'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800',
  'Postre',
  r.id,
  NOW(),
  NOW()
FROM "Restaurant" r WHERE r.name = 'Bandeja Paisa';

-- CHILE 🇨🇱 - Empanadas de Pino
INSERT INTO "Product" (id, name, description, price, image, category, "restaurantId", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Empanadas de Pino',
  'Empanadas chilenas de carne, cebolla, pasas y aceitunas',
  13.00,
  'https://images.unsplash.com/photo-1565299585323-38174c3d6c6e?w=800',
  'Plato',
  r.id,
  NOW(),
  NOW()
FROM "Restaurant" r WHERE r.name = 'Empanadas de Pino';

INSERT INTO "Product" (id, name, description, price, image, category, "restaurantId", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Pastel de Choclo',
  'Pastel de choclo casero con carne y pollo',
  18.00,
  'https://images.unsplash.com/photo-1558030006-450675393462?w=800',
  'Plato',
  r.id,
  NOW(),
  NOW()
FROM "Restaurant" r WHERE r.name = 'Empanadas de Pino';

INSERT INTO "Product" (id, name, description, price, image, category, "restaurantId", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Mote con Huesillo',
  'Bebida chilena tradicional con durazno y trigo mote',
  6.00,
  'https://images.unsplash.com/photo-1551538827-9c0370b36079?w=800',
  'Bebida',
  r.id,
  NOW(),
  NOW()
FROM "Restaurant" r WHERE r.name = 'Empanadas de Pino';

INSERT INTO "Product" (id, name, description, price, image, category, "restaurantId", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Tres Leches',
  'Torta de tres leches chilena',
  9.00,
  'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800',
  'Postre',
  r.id,
  NOW(),
  NOW()
FROM "Restaurant" r WHERE r.name = 'Empanadas de Pino';

-- GRECIA 🇬🇷 - Souvlaki Athens
INSERT INTO "Product" (id, name, description, price, image, category, "restaurantId", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Souvlaki de Pollo',
  'Brochetas de pollo griego con tzatziki, tomate, cebolla y pan pita',
  16.00,
  'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=800',
  'Plato',
  r.id,
  NOW(),
  NOW()
FROM "Restaurant" r WHERE r.name = 'Souvlaki Athens';

INSERT INTO "Product" (id, name, description, price, image, category, "restaurantId", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Gyros de Cerdo',
  'Gyros griego con carne de cerdo, tzatziki, papas fritas y pan pita',
  17.00,
  'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=800',
  'Plato',
  r.id,
  NOW(),
  NOW()
FROM "Restaurant" r WHERE r.name = 'Souvlaki Athens';

INSERT INTO "Product" (id, name, description, price, image, category, "restaurantId", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Ouzo',
  'Licor anisado griego tradicional',
  10.00,
  'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800',
  'Bebida',
  r.id,
  NOW(),
  NOW()
FROM "Restaurant" r WHERE r.name = 'Souvlaki Athens';

INSERT INTO "Product" (id, name, description, price, image, category, "restaurantId", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Baklava Griego',
  'Postre griego de hojaldre con nueces y miel',
  8.00,
  'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800',
  'Postre',
  r.id,
  NOW(),
  NOW()
FROM "Restaurant" r WHERE r.name = 'Souvlaki Athens';

-- COREA 🇰🇷 - Bulgogi House
INSERT INTO "Product" (id, name, description, price, image, category, "restaurantId", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Bulgogi',
  'Carne de res marinada a la parrilla con arroz y kimchi',
  24.00,
  'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
  'Plato',
  r.id,
  NOW(),
  NOW()
FROM "Restaurant" r WHERE r.name = 'Bulgogi House';

INSERT INTO "Product" (id, name, description, price, image, category, "restaurantId", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Bibimbap',
  'Arroz con verduras, carne, huevo y gochujang',
  19.00,
  'https://images.unsplash.com/photo-1558030006-450675393462?w=800',
  'Plato',
  r.id,
  NOW(),
  NOW()
FROM "Restaurant" r WHERE r.name = 'Bulgogi House';

INSERT INTO "Product" (id, name, description, price, image, category, "restaurantId", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Soju',
  'Licor coreano tradicional de arroz',
  8.00,
  'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800',
  'Bebida',
  r.id,
  NOW(),
  NOW()
FROM "Restaurant" r WHERE r.name = 'Bulgogi House';

INSERT INTO "Product" (id, name, description, price, image, category, "restaurantId", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Bingsu',
  'Postre coreano de hielo raspado con frutas y leche condensada',
  10.00,
  'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800',
  'Postre',
  r.id,
  NOW(),
  NOW()
FROM "Restaurant" r WHERE r.name = 'Bulgogi House';

-- TAILANDIA 🇹🇭 - Pad Thai Original
INSERT INTO "Product" (id, name, description, price, image, category, "restaurantId", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Pad Thai',
  'Fideos tailandeses salteados con camarones, tofu, huevo y salsa tamarindo',
  18.00,
  'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800',
  'Plato',
  r.id,
  NOW(),
  NOW()
FROM "Restaurant" r WHERE r.name = 'Pad Thai Original';

INSERT INTO "Product" (id, name, description, price, image, category, "restaurantId", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Tom Yum Goong',
  'Sopa tailandesa picante y ácida con camarones y hierbas aromáticas',
  16.00,
  'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800',
  'Plato',
  r.id,
  NOW(),
  NOW()
FROM "Restaurant" r WHERE r.name = 'Pad Thai Original';

INSERT INTO "Product" (id, name, description, price, image, category, "restaurantId", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Té Helado Tailandés',
  'Té tailandés helado con leche condensada',
  5.00,
  'https://images.unsplash.com/photo-1551538827-9c0370b36079?w=800',
  'Bebida',
  r.id,
  NOW(),
  NOW()
FROM "Restaurant" r WHERE r.name = 'Pad Thai Original';

INSERT INTO "Product" (id, name, description, price, image, category, "restaurantId", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Mango Sticky Rice',
  'Arroz glutinoso con mango y leche de coco',
  9.00,
  'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800',
  'Postre',
  r.id,
  NOW(),
  NOW()
FROM "Restaurant" r WHERE r.name = 'Pad Thai Original';

-- INDIA 🇮🇳 - Curry House India
INSERT INTO "Product" (id, name, description, price, image, category, "restaurantId", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Butter Chicken',
  'Pollo en salsa de mantequilla y tomate con arroz basmati y naan',
  22.00,
  'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800',
  'Plato',
  r.id,
  NOW(),
  NOW()
FROM "Restaurant" r WHERE r.name = 'Curry House India';

INSERT INTO "Product" (id, name, description, price, image, category, "restaurantId", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Biryani de Pollo',
  'Arroz aromático con pollo, especias y hierbas',
  20.00,
  'https://images.unsplash.com/photo-1558030006-450675393462?w=800',
  'Plato',
  r.id,
  NOW(),
  NOW()
FROM "Restaurant" r WHERE r.name = 'Curry House India';

INSERT INTO "Product" (id, name, description, price, image, category, "restaurantId", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Lassi de Mango',
  'Bebida india de yogur con mango',
  6.00,
  'https://images.unsplash.com/photo-1551538827-9c0370b36079?w=800',
  'Bebida',
  r.id,
  NOW(),
  NOW()
FROM "Restaurant" r WHERE r.name = 'Curry House India';

INSERT INTO "Product" (id, name, description, price, image, category, "restaurantId", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Gulab Jamun',
  'Postre indio de bolas de leche fritas en almíbar',
  7.00,
  'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800',
  'Postre',
  r.id,
  NOW(),
  NOW()
FROM "Restaurant" r WHERE r.name = 'Curry House India';

-- FRANCIA 🇫🇷 - Boulangerie Parisienne
INSERT INTO "Product" (id, name, description, price, image, category, "restaurantId", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Croissant de Mantequilla',
  'Croissant francés artesanal con mantequilla',
  4.00,
  'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800',
  'Plato',
  r.id,
  NOW(),
  NOW()
FROM "Restaurant" r WHERE r.name = 'Boulangerie Parisienne';

INSERT INTO "Product" (id, name, description, price, image, category, "restaurantId", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Baguette Tradicional',
  'Pan baguette francés recién horneado',
  3.00,
  'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800',
  'Plato',
  r.id,
  NOW(),
  NOW()
FROM "Restaurant" r WHERE r.name = 'Boulangerie Parisienne';

INSERT INTO "Product" (id, name, description, price, image, category, "restaurantId", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Café au Lait',
  'Café con leche al estilo francés',
  5.00,
  'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800',
  'Bebida',
  r.id,
  NOW(),
  NOW()
FROM "Restaurant" r WHERE r.name = 'Boulangerie Parisienne';

INSERT INTO "Product" (id, name, description, price, image, category, "restaurantId", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'Éclair au Chocolat',
  'Éclair francés relleno de crema y cubierto de chocolate',
  6.00,
  'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800',
  'Postre',
  r.id,
  NOW(),
  NOW()
FROM "Restaurant" r WHERE r.name = 'Boulangerie Parisienne';

