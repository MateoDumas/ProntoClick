# 🌍 Guía: Insertar Restaurantes Multiculturales

Esta guía te ayudará a insertar 12 restaurantes de diferentes culturas (uno por cada cultura) en tu base de datos Supabase.

## 📋 Pasos para Insertar

### 1. Abrir Supabase SQL Editor

1. Ve a tu proyecto en [Supabase](https://supabase.com)
2. En el menú lateral, haz clic en **"SQL Editor"**
3. Haz clic en **"New query"** para crear una nueva consulta

### 2. Copiar el Script SQL

1. Abre el archivo `INSERTAR_RESTAURANTES_MULTICULTURALES.sql` en tu editor
2. Copia **todo el contenido** del archivo
3. Pégalo en el SQL Editor de Supabase

### 3. Ejecutar el Script

1. Haz clic en el botón **"Run"** (o presiona `Ctrl + Enter`)
2. Espera a que se complete la ejecución
3. Deberías ver un mensaje de éxito indicando que se insertaron los restaurantes

### 4. Verificar los Restaurantes

1. Ve a **"Table Editor"** en Supabase
2. Selecciona la tabla **"Restaurant"**
3. Deberías ver los 12 nuevos restaurantes (uno por cada cultura)

## 🎨 Agregar Imágenes a los Restaurantes

Los restaurantes se insertan con URLs de imágenes de Unsplash. Si quieres usar tus propias imágenes:

### Opción 1: Subir Imágenes por URL (Recomendado)

Usa Postman o tu herramienta favorita para subir imágenes:

**Endpoint:** `POST https://prontoclick-backend.onrender.com/upload/restaurant/:id/image-url`

**Headers:**
```
Authorization: Bearer [TU_TOKEN_JWT]
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "url": "https://tu-url-de-imagen.com/imagen.jpg"
}
```

**Ejemplo:**
```
POST https://prontoclick-backend.onrender.com/upload/restaurant/[ID_DEL_RESTAURANTE]/image-url
```

### Opción 2: Actualizar Manualmente en Supabase

1. Ve a **"Table Editor"** → **"Restaurant"**
2. Haz clic en el restaurante que quieres actualizar
3. Edita el campo **"image"** con la URL de tu imagen
4. Guarda los cambios

## 📊 Restaurantes Incluidos (12 restaurantes, uno por cultura)

### 🇧🇷 Brasil
- **Feijoada do Brasil** - Auténtica feijoada brasileña

### 🇦🇷 Argentina
- **Parrilla Argentina** - Asado argentino tradicional

### 🇵🇪 Perú
- **Cevichería El Pescador** - Ceviche fresco del día

### 🇪🇸 España
- **Paella Valenciana** - Paella auténtica valenciana

### 🇹🇷 Turquía
- **Kebab Istanbul** - Kebab auténtico turco

### 🇨🇴 Colombia
- **Bandeja Paisa** - Bandeja paisa completa

### 🇨🇱 Chile
- **Empanadas de Pino** - Empanadas chilenas tradicionales

### 🇬🇷 Grecia
- **Souvlaki Athens** - Souvlaki griego auténtico

### 🇰🇷 Corea
- **Bulgogi House** - Bulgogi coreano auténtico

### 🇹🇭 Tailandia
- **Pad Thai Original** - Pad Thai auténtico tailandés

### 🇮🇳 India
- **Curry House India** - Curries indios auténticos

### 🇫🇷 Francia
- **Boulangerie Parisienne** - Baguettes y pastelería francesa

## ✅ Verificación

Después de insertar, verifica que:

1. ✅ Los 12 restaurantes aparecen en la tabla `Restaurant`
2. ✅ Cada restaurante tiene nombre, descripción y rating
3. ✅ Las imágenes se cargan correctamente (o actualízalas después)
4. ✅ Los restaurantes aparecen en tu aplicación frontend
5. ✅ Hay un restaurante representativo de cada cultura

---

## 📦 Siguiente Paso: Insertar Productos

Una vez que hayas insertado los restaurantes, puedes agregar productos típicos para cada uno usando:

- **Script**: `INSERTAR_PRODUCTOS_RESTAURANTES.sql`
- **Guía**: `GUIA_INSERTAR_PRODUCTOS.md`

Cada restaurante tendrá 4 productos: 2 platos principales, 1 bebida y 1 postre típicos de su cultura.

## 🔄 Si Necesitas Modificar

Si quieres modificar algún restaurante después de insertarlo:

1. Ve a **"Table Editor"** → **"Restaurant"**
2. Busca el restaurante por nombre
3. Haz clic en la fila para editarlo
4. Modifica los campos que necesites
5. Guarda los cambios

## 🚨 Solución de Problemas

### Error: "duplicate key value violates unique constraint"
- **Causa:** Ya existe un restaurante con ese ID
- **Solución:** Los IDs se generan automáticamente con `gen_random_uuid()`, así que esto no debería pasar. Si ocurre, ejecuta el script de nuevo.

### Error: "null value in column violates not-null constraint"
- **Causa:** Falta algún campo requerido
- **Solución:** Verifica que todos los campos requeridos estén en el INSERT (name, description, createdAt, updatedAt)

### Los restaurantes no aparecen en la app
- **Causa:** Puede ser un problema de caché o la app no está conectada al backend
- **Solución:** 
  1. Refresca la página de la app
  2. Verifica que `NEXT_PUBLIC_API_URL` esté configurado en Vercel
  3. Revisa la consola del navegador para errores

## 📝 Notas

- Las imágenes usan URLs de Unsplash por defecto
- Los ratings están entre 4.6 y 4.9
- Los tiempos de entrega varían según el tipo de comida
- Los precios mínimos están en dólares (ajusta según tu moneda)

¡Disfruta de tu aplicación con restaurantes multiculturales! 🌍🍽️

