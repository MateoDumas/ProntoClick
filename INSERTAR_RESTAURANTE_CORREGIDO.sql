-- SQL para insertar restaurante con todos los campos requeridos
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
  );

