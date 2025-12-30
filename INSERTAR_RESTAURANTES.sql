-- Insertar múltiples restaurantes de ejemplo
-- Nota: Necesitarás subir imágenes para cada uno después

INSERT INTO "Restaurant" (id, name, description, image, rating, "createdAt", "updatedAt")
VALUES 
  (
    gen_random_uuid(),
    'Pizza Express',
    'Deliciosas pizzas artesanales con ingredientes frescos',
    'https://res.cloudinary.com/dvoas1kmw/image/upload/v1767037128/prontoclick/products/f0nqqbnuqedo2esttwmf.jpg',
    4.5,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Sushi Master',
    'Sushi fresco y auténtico preparado por chefs japoneses',
    'https://res.cloudinary.com/dvoas1kmw/image/upload/v1767037128/prontoclick/products/f0nqqbnuqedo2esttwmf.jpg',
    4.8,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Burger House',
    'Hamburguesas gourmet con carne 100% premium',
    'https://res.cloudinary.com/dvoas1kmw/image/upload/v1767037128/prontoclick/products/f0nqqbnuqedo2esttwmf.jpg',
    4.6,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Taco Loco',
    'Los mejores tacos mexicanos con salsas caseras',
    'https://res.cloudinary.com/dvoas1kmw/image/upload/v1767037128/prontoclick/products/f0nqqbnuqedo2esttwmf.jpg',
    4.7,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Pasta Italiana',
    'Pastas artesanales con recetas tradicionales italianas',
    'https://res.cloudinary.com/dvoas1kmw/image/upload/v1767037128/prontoclick/products/f0nqqbnuqedo2esttwmf.jpg',
    4.4,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Wok Express',
    'Comida asiática fresca preparada al momento',
    'https://res.cloudinary.com/dvoas1kmw/image/upload/v1767037128/prontoclick/products/f0nqqbnuqedo2esttwmf.jpg',
    4.5,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'BBQ Grill',
    'Carnes a la parrilla con el mejor sabor',
    'https://res.cloudinary.com/dvoas1kmw/image/upload/v1767037128/prontoclick/products/f0nqqbnuqedo2esttwmf.jpg',
    4.9,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Café Delicioso',
    'Café de especialidad y pastelería artesanal',
    'https://res.cloudinary.com/dvoas1kmw/image/upload/v1767037128/prontoclick/products/f0nqqbnuqedo2esttwmf.jpg',
    4.3,
    NOW(),
    NOW()
  );

