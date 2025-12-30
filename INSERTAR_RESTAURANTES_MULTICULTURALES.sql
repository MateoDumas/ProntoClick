-- Insertar restaurantes de diferentes culturas
-- Brasil, Argentina, Perú, España, Turquía, Colombia, Chile, Grecia, Corea, Tailandia, India, Francia

INSERT INTO "Restaurant" (id, name, description, image, rating, "deliveryTime", "minOrder", "createdAt", "updatedAt")
VALUES 
  -- BRASIL 🇧🇷
  (
    gen_random_uuid(),
    'Feijoada do Brasil',
    'Auténtica feijoada brasileña con todos los acompañamientos tradicionales. Sabor único de Brasil',
    'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800',
    4.8,
    '30-40 min',
    18.00,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Churrasco Gaúcho',
    'Carnes a la parrilla estilo brasileño. Picanha, costillas y más cortes premium',
    'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
    4.9,
    '35-45 min',
    22.00,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Acarajé da Bahia',
    'Delicias de Bahía: acarajé, vatapá y moqueca. Sabores auténticos del nordeste brasileño',
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800',
    4.7,
    '25-35 min',
    15.00,
    NOW(),
    NOW()
  ),

  -- ARGENTINA 🇦🇷
  (
    gen_random_uuid(),
    'Parrilla Argentina',
    'Asado argentino tradicional con chimichurri casero. Las mejores carnes a la parrilla',
    'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
    4.9,
    '40-50 min',
    25.00,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Empanadas del Sur',
    'Empanadas artesanales: carne, pollo, jamón y queso, humita. Receta familiar tradicional',
    'https://images.unsplash.com/photo-1565299585323-38174c3d6c6e?w=800',
    4.8,
    '20-30 min',
    12.00,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Milanesa Napolitana',
    'Milanesas caseras con papas fritas. Clásico argentino que no puede faltar',
    'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800',
    4.6,
    '25-35 min',
    16.00,
    NOW(),
    NOW()
  ),

  -- PERÚ 🇵🇪
  (
    gen_random_uuid(),
    'Cevichería El Pescador',
    'Ceviche fresco del día con leche de tigre. Los mejores pescados y mariscos peruanos',
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800',
    4.9,
    '25-35 min',
    20.00,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Lomo Saltado',
    'Lomo saltado tradicional peruano con papas fritas y arroz. Fusión peruano-china auténtica',
    'https://images.unsplash.com/photo-1558030006-450675393462?w=800',
    4.8,
    '30-40 min',
    18.00,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Anticuchos El Inca',
    'Anticuchos de corazón, pollo y carne. Sabor único de la cocina peruana callejera',
    'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=800',
    4.7,
    '20-30 min',
    14.00,
    NOW(),
    NOW()
  ),

  -- ESPAÑA 🇪🇸
  (
    gen_random_uuid(),
    'Paella Valenciana',
    'Paella auténtica valenciana con mariscos frescos. Receta tradicional española',
    'https://images.unsplash.com/photo-1558030006-450675393462?w=800',
    4.9,
    '35-45 min',
    28.00,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Tapas Barcelona',
    'Variedad de tapas españolas: jamón ibérico, croquetas, patatas bravas y más',
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800',
    4.8,
    '20-30 min',
    15.00,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Gazpacho Andaluz',
    'Gazpacho fresco y salmorejo. Platos fríos tradicionales de Andalucía',
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
    4.6,
    '15-25 min',
    12.00,
    NOW(),
    NOW()
  ),

  -- TURQUÍA 🇹🇷
  (
    gen_random_uuid(),
    'Kebab Istanbul',
    'Kebab auténtico turco: döner, shish, adana. Pan pita fresco y salsas tradicionales',
    'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=800',
    4.9,
    '20-30 min',
    14.00,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Baklava House',
    'Baklava casero con pistachos y miel. Postres turcos tradicionales y café turco',
    'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800',
    4.8,
    '15-25 min',
    10.00,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Lahmacun Express',
    'Lahmacun y pide turcos recién horneados. Sabor auténtico de la cocina turca',
    'https://images.unsplash.com/photo-1565299585323-38174c3d6c6e?w=800',
    4.7,
    '18-28 min',
    12.00,
    NOW(),
    NOW()
  ),

  -- COLOMBIA 🇨🇴
  (
    gen_random_uuid(),
    'Bandeja Paisa',
    'Bandeja paisa completa: frijoles, arroz, chicharrón, huevo, aguacate. Tradición antioqueña',
    'https://images.unsplash.com/photo-1558030006-450675393462?w=800',
    4.8,
    '30-40 min',
    20.00,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Arepas Colombianas',
    'Arepas rellenas: queso, carne desmechada, pollo, huevo. Desayuno y almuerzo colombiano',
    'https://images.unsplash.com/photo-1565299585323-38174c3d6c6e?w=800',
    4.7,
    '20-30 min',
    11.00,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Ajiaco Santafereño',
    'Ajiaco bogotano tradicional con pollo, papa y alcaparras. Sabor único de la capital',
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800',
    4.9,
    '25-35 min',
    17.00,
    NOW(),
    NOW()
  ),

  -- CHILE 🇨🇱
  (
    gen_random_uuid(),
    'Empanadas de Pino',
    'Empanadas chilenas de pino tradicional. Receta casera con pasas y aceitunas',
    'https://images.unsplash.com/photo-1565299585323-38174c3d6c6e?w=800',
    4.8,
    '20-30 min',
    13.00,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Pastel de Choclo',
    'Pastel de choclo casero con carne y pollo. Clásico de la cocina chilena',
    'https://images.unsplash.com/photo-1558030006-450675393462?w=800',
    4.7,
    '30-40 min',
    18.00,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Completo Italiano',
    'Completos chilenos: italiano, dinámico, tradicional. El hot dog más grande del mundo',
    'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800',
    4.6,
    '15-25 min',
    8.00,
    NOW(),
    NOW()
  ),

  -- GRECIA 🇬🇷
  (
    gen_random_uuid(),
    'Souvlaki Athens',
    'Souvlaki griego auténtico con tzatziki casero. Gyros y platos tradicionales griegos',
    'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=800',
    4.9,
    '20-30 min',
    15.00,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Moussaka House',
    'Moussaka casera griega con berenjena y carne. Sabor auténtico de las islas griegas',
    'https://images.unsplash.com/photo-1558030006-450675393462?w=800',
    4.8,
    '30-40 min',
    20.00,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Greek Mezze',
    'Mezze griego: hummus, tzatziki, dolmades, spanakopita. Sabores mediterráneos auténticos',
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800',
    4.7,
    '25-35 min',
    18.00,
    NOW(),
    NOW()
  ),

  -- COREA 🇰🇷
  (
    gen_random_uuid(),
    'Bulgogi House',
    'Bulgogi coreano auténtico: carne marinada a la parrilla. Kimchi casero incluido',
    'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
    4.9,
    '25-35 min',
    22.00,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Bibimbap Seoul',
    'Bibimbap tradicional coreano con arroz, verduras y huevo. Sabor único de Corea',
    'https://images.unsplash.com/photo-1558030006-450675393462?w=800',
    4.8,
    '20-30 min',
    17.00,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Korean BBQ',
    'Barbacoa coreana: galbi, samgyeopsal, bulgogi. Cocina en tu mesa con banchan',
    'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
    4.7,
    '30-40 min',
    25.00,
    NOW(),
    NOW()
  ),

  -- TAILANDIA 🇹🇭
  (
    gen_random_uuid(),
    'Pad Thai Original',
    'Pad Thai auténtico tailandés con camarones y tofu. Sabor equilibrado y delicioso',
    'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800',
    4.8,
    '25-35 min',
    17.00,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Tom Yum Goong',
    'Sopa tailandesa picante y ácida. Camarones frescos con hierbas aromáticas',
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800',
    4.7,
    '20-30 min',
    16.00,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Curry Tailandés',
    'Curries tailandeses: verde, rojo, amarillo. Leche de coco y especias auténticas',
    'https://images.unsplash.com/photo-1558030006-450675393462?w=800',
    4.9,
    '25-35 min',
    19.00,
    NOW(),
    NOW()
  ),

  -- INDIA 🇮🇳
  (
    gen_random_uuid(),
    'Curry House India',
    'Curries indios auténticos: butter chicken, tikka masala, vindaloo. Arroz basmati incluido',
    'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800',
    4.8,
    '30-40 min',
    20.00,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Biryani Express',
    'Biryani tradicional con pollo, cordero o vegetariano. Arroz aromático con especias',
    'https://images.unsplash.com/photo-1558030006-450675393462?w=800',
    4.9,
    '35-45 min',
    22.00,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Tandoori Grill',
    'Carnes y panes cocidos en tandoor. Pollo tandoori, naan fresco y más',
    'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
    4.7,
    '25-35 min',
    18.00,
    NOW(),
    NOW()
  ),

  -- FRANCIA 🇫🇷
  (
    gen_random_uuid(),
    'Boulangerie Parisienne',
    'Baguettes frescas, croissants y pastelería francesa. Auténtico sabor parisino',
    'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800',
    4.8,
    '15-25 min',
    12.00,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Coq au Vin',
    'Platos franceses clásicos: coq au vin, boeuf bourguignon, ratatouille',
    'https://images.unsplash.com/photo-1558030006-450675393462?w=800',
    4.7,
    '35-45 min',
    26.00,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Crêperie Bretonne',
    'Crêpes dulces y saladas estilo bretón. Auténtica receta francesa',
    'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800',
    4.6,
    '20-30 min',
    14.00,
    NOW(),
    NOW()
  );

