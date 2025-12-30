# 🍽️ Guía: Insertar Productos para Restaurantes

Esta guía te ayudará a insertar productos típicos (platos, bebidas y postres) para cada uno de los 12 restaurantes multiculturales.

## 📋 Requisitos Previos

✅ **IMPORTANTE**: Debes haber insertado primero los restaurantes usando `INSERTAR_RESTAURANTES_MULTICULTURALES.sql`

Si aún no lo has hecho, sigue primero la guía en `GUIA_INSERTAR_RESTAURANTES_MULTICULTURALES.md`

---

## 🚀 Pasos para Insertar los Productos

### 1. Abrir Supabase SQL Editor

1. Ve a tu proyecto en [Supabase](https://supabase.com)
2. Haz clic en **"SQL Editor"** en el menú lateral
3. Haz clic en **"New query"**

### 2. Copiar y Pegar el Script

1. Abre el archivo `INSERTAR_PRODUCTOS_RESTAURANTES.sql`
2. Copia **todo el contenido** del archivo
3. Pégalo en el editor SQL de Supabase

### 3. Ejecutar el Script

1. Haz clic en **"Run"** o presiona `Ctrl + Enter` (Windows) / `Cmd + Enter` (Mac)
2. Espera a que termine la ejecución
3. Deberías ver un mensaje de éxito

---

## 📊 Productos Incluidos por Restaurante

Cada restaurante tendrá **4 productos**:
- **2 Platos principales** típicos de la cultura
- **1 Bebida** (típica o común)
- **1 Postre** tradicional

### 🇧🇷 Brasil - Feijoada do Brasil
- Feijoada Completa (Plato)
- Picanha na Chapa (Plato)
- Caipirinha (Bebida)
- Brigadeiro (Postre)

### 🇦🇷 Argentina - Parrilla Argentina
- Asado de Tira (Plato)
- Empanadas Criollas (Plato)
- Malbec (Bebida)
- Dulce de Leche con Panqueques (Postre)

### 🇵🇪 Perú - Cevichería El Pescador
- Ceviche de Pescado (Plato)
- Lomo Saltado (Plato)
- Chicha Morada (Bebida)
- Suspiro Limeño (Postre)

### 🇪🇸 España - Paella Valenciana
- Paella de Mariscos (Plato)
- Tortilla Española (Plato)
- Sangría (Bebida)
- Flan de Huevo (Postre)

### 🇹🇷 Turquía - Kebab Istanbul
- Döner Kebab (Plato)
- Lahmacun (Plato)
- Ayran (Bebida)
- Baklava (Postre)

### 🇨🇴 Colombia - Bandeja Paisa
- Bandeja Paisa Completa (Plato)
- Arepa Rellena (Plato)
- Jugo de Lulo (Bebida)
- Arequipe con Queso (Postre)

### 🇨🇱 Chile - Empanadas de Pino
- Empanadas de Pino (Plato)
- Pastel de Choclo (Plato)
- Mote con Huesillo (Bebida)
- Tres Leches (Postre)

### 🇬🇷 Grecia - Souvlaki Athens
- Souvlaki de Pollo (Plato)
- Gyros de Cerdo (Plato)
- Ouzo (Bebida)
- Baklava Griego (Postre)

### 🇰🇷 Corea - Bulgogi House
- Bulgogi (Plato)
- Bibimbap (Plato)
- Soju (Bebida)
- Bingsu (Postre)

### 🇹🇭 Tailandia - Pad Thai Original
- Pad Thai (Plato)
- Tom Yum Goong (Plato)
- Té Helado Tailandés (Bebida)
- Mango Sticky Rice (Postre)

### 🇮🇳 India - Curry House India
- Butter Chicken (Plato)
- Biryani de Pollo (Plato)
- Lassi de Mango (Bebida)
- Gulab Jamun (Postre)

### 🇫🇷 Francia - Boulangerie Parisienne
- Croissant de Mantequilla (Plato)
- Baguette Tradicional (Plato)
- Café au Lait (Bebida)
- Éclair au Chocolat (Postre)

---

## ✅ Verificación

Después de insertar, verifica que:

1. ✅ Los productos aparecen en la tabla `Product`
2. ✅ Cada restaurante tiene 4 productos asociados
3. ✅ Los productos tienen categorías: "Plato", "Bebida", "Postre"
4. ✅ Los productos aparecen en tu aplicación frontend cuando seleccionas un restaurante

### Consulta de Verificación

Puedes ejecutar esta consulta en Supabase para verificar:

```sql
SELECT 
  r.name AS restaurante,
  COUNT(p.id) AS total_productos,
  COUNT(CASE WHEN p.category = 'Plato' THEN 1 END) AS platos,
  COUNT(CASE WHEN p.category = 'Bebida' THEN 1 END) AS bebidas,
  COUNT(CASE WHEN p.category = 'Postre' THEN 1 END) AS postres
FROM "Restaurant" r
LEFT JOIN "Product" p ON p."restaurantId" = r.id
WHERE r.name IN (
  'Feijoada do Brasil',
  'Parrilla Argentina',
  'Cevichería El Pescador',
  'Paella Valenciana',
  'Kebab Istanbul',
  'Bandeja Paisa',
  'Empanadas de Pino',
  'Souvlaki Athens',
  'Bulgogi House',
  'Pad Thai Original',
  'Curry House India',
  'Boulangerie Parisienne'
)
GROUP BY r.name
ORDER BY r.name;
```

Deberías ver 12 restaurantes, cada uno con 4 productos (2 platos, 1 bebida, 1 postre).

---

## 🔧 Solución de Problemas

### Error: "restaurantId does not exist"
- **Causa**: Los restaurantes no han sido insertados aún
- **Solución**: Ejecuta primero `INSERTAR_RESTAURANTES_MULTICULTURALES.sql`

### Error: "No rows found for restaurant name"
- **Causa**: El nombre del restaurante no coincide exactamente
- **Solución**: Verifica que los nombres en ambos scripts sean idénticos

### Productos duplicados
- **Causa**: El script se ejecutó múltiples veces
- **Solución**: Elimina los productos duplicados o ejecuta el script solo una vez

---

## 📝 Notas

- Los precios están en USD y son aproximados
- Las imágenes son placeholders de Unsplash
- Puedes actualizar las imágenes después usando el endpoint `/upload/product/:id/image-url`
- Las categorías son: "Plato", "Bebida", "Postre"

---

¡Listo! Ahora tus restaurantes tienen productos típicos de cada cultura. 🎉

