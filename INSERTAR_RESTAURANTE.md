# 🍕 Insertar Restaurante en Supabase

## 📋 Opción 1: Insertar Manualmente (Rápido)

### Pasos en Supabase:

1. **Haz clic en el botón "Insert"** (arriba a la derecha en la tabla)
2. Se abrirá un formulario para insertar un nuevo registro
3. Completa los campos:
   - **id:** Genera un UUID o usa: `550e8400-e29b-41d4-a716-446655440000`
   - **name:** `Pizza Express` (o el nombre que quieras)
   - **description:** `Deliciosas pizzas artesanales con ingredientes frescos`
   - **image:** Pega la URL de Cloudinary:
     ```
     https://res.cloudinary.com/dvoas1kmw/image/upload/v1767037128/prontoclick/products/f0nqqbnuqedo2esttwmf.jpg
     ```
   - **rating:** `4.5` (opcional)
4. Haz clic en **"Save"** o presiona `Enter`

---

## 📋 Opción 2: Usar SQL (Más Rápido para Múltiples)

1. En Supabase, ve a **"SQL Editor"** (en el menú lateral)
2. Haz clic en **"New query"**
3. Pega este SQL:

```sql
INSERT INTO "Restaurant" (id, name, description, image, rating)
VALUES 
  (
    gen_random_uuid(),
    'Pizza Express',
    'Deliciosas pizzas artesanales con ingredientes frescos',
    'https://res.cloudinary.com/dvoas1kmw/image/upload/v1767037128/prontoclick/products/f0nqqbnuqedo2esttwmf.jpg',
    4.5
  );
```

4. Haz clic en **"Run"** (o presiona `Ctrl + Enter`)

---

## 📋 Opción 3: Insertar Múltiples Restaurantes

Si quieres insertar varios restaurantes de prueba:

```sql
INSERT INTO "Restaurant" (id, name, description, image, rating)
VALUES 
  (
    gen_random_uuid(),
    'Pizza Express',
    'Deliciosas pizzas artesanales con ingredientes frescos',
    'https://res.cloudinary.com/dvoas1kmw/image/upload/v1767037128/prontoclick/products/f0nqqbnuqedo2esttwmf.jpg',
    4.5
  ),
  (
    gen_random_uuid(),
    'Sushi Master',
    'Sushi fresco y auténtico preparado por chefs japoneses',
    'https://res.cloudinary.com/dvoas1kmw/image/upload/v1767037128/prontoclick/products/f0nqqbnuqedo2esttwmf.jpg',
    4.8
  ),
  (
    gen_random_uuid(),
    'Burger House',
    'Hamburguesas gourmet con carne 100% premium',
    'https://res.cloudinary.com/dvoas1kmw/image/upload/v1767037128/prontoclick/products/f0nqqbnuqedo2esttwmf.jpg',
    4.6
  );
```

---

## ✅ Verificar

Después de insertar:
1. Vuelve a **"Table Editor"**
2. Selecciona la tabla **"Restaurant"**
3. Deberías ver el restaurante que acabas de insertar
4. La imagen debería aparecer en la columna `image`

---

## 🎯 Próximos Pasos

Una vez que tengas restaurantes:
1. Puedes subir más imágenes usando Postman
2. Actualizar las imágenes de los restaurantes existentes
3. Verificar que las imágenes se muestren en tu app: https://pronto-click.vercel.app

---

## 💡 Tip

Si quieres usar imágenes diferentes para cada restaurante:
1. Sube una imagen nueva en Postman
2. Copia la nueva URL
3. Actualiza el campo `image` del restaurante en Supabase

¡Listo! 🚀

