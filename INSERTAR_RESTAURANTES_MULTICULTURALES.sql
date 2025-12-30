-- Insertar restaurantes de diferentes culturas
-- Un restaurante representativo por cada cultura
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
  );
