# 🚀 Subir Imágenes Automáticamente (Sin Postman + Supabase)

## ✅ ¡Ya No Necesitas Hacerlo Manualmente!

Ahora tienes **2 nuevos endpoints** que suben la imagen **Y actualizan la base de datos automáticamente** en una sola request.

---

## 📋 Nuevos Endpoints

### 1. Subir Imagen de Restaurante y Actualizar
```
POST /upload/restaurant/:id/image
```

**Ejemplo:**
```
POST https://prontoclick-backend.onrender.com/upload/restaurant/72736861-c0ac-489d-a47d-7062db9fd5a8/image
```

**Headers:**
- `Authorization: Bearer TU_JWT_TOKEN`

**Body:**
- `form-data`
- Campo: `file` (tipo File)
- Selecciona una imagen

**Respuesta:**
```json
{
  "success": true,
  "message": "Imagen subida y actualizada correctamente",
  "url": "https://res.cloudinary.com/...",
  "publicId": "prontoclick/restaurants/...",
  "restaurant": {
    "id": "...",
    "name": "Pizza Express",
    "image": "https://res.cloudinary.com/..."
  }
}
```

---

### 2. Subir Imagen de Producto y Actualizar
```
POST /upload/product/:id/image
```

**Ejemplo:**
```
POST https://prontoclick-backend.onrender.com/upload/product/PRODUCT_ID/image
```

**Headers:**
- `Authorization: Bearer TU_JWT_TOKEN`

**Body:**
- `form-data`
- Campo: `file` (tipo File)
- Selecciona una imagen

**Respuesta:**
```json
{
  "success": true,
  "message": "Imagen subida y actualizada correctamente",
  "url": "https://res.cloudinary.com/...",
  "publicId": "prontoclick/products/...",
  "product": {
    "id": "...",
    "name": "Pizza Margarita",
    "image": "https://res.cloudinary.com/..."
  }
}
```

---

## 🎯 Cómo Usar

### Opción 1: Postman (Rápido)

1. **Obtén el ID del restaurante/producto:**
   - Ve a Supabase → Table Editor
   - Selecciona `Restaurant` o `Product`
   - Copia el `id` del registro que quieres actualizar

2. **Crea la request en Postman:**
   - Method: `POST`
   - URL: `https://prontoclick-backend.onrender.com/upload/restaurant/[ID]/image`
   - Headers: `Authorization: Bearer TU_JWT_TOKEN`
   - Body: `form-data` → `file` (tipo File) → Selecciona imagen
   - Click "Send"

3. **¡Listo!** La imagen se subió Y se actualizó automáticamente en la base de datos.

---

### Opción 2: Desde el Frontend (Mejor)

Puedes usar el componente `ImageUpload` que ya creamos y modificarlo para que use estos nuevos endpoints.

---

## 📊 Comparación

### ❌ Método Anterior (Manual):
1. Subir imagen en Postman → Obtener URL
2. Ir a Supabase → Editar registro → Pegar URL → Guardar
3. **2 pasos manuales**

### ✅ Método Nuevo (Automático):
1. Subir imagen en Postman con el ID del restaurante/producto
2. **¡Listo!** Todo se actualiza automáticamente
3. **1 paso automático**

---

## 🎨 Próximo Paso: Panel de Administración

Puedo crear un panel de administración en tu frontend donde:
- Veas todos los restaurantes/productos
- Hagas clic en "Subir Imagen"
- Selecciones la imagen
- Se actualice automáticamente

¿Te gustaría que lo cree?

---

## ✅ Resumen

**Endpoints disponibles:**
- `POST /upload/restaurant/:id/image` - Sube y actualiza imagen de restaurante
- `POST /upload/product/:id/image` - Sube y actualiza imagen de producto
- `POST /upload/restaurant-image` - Solo sube (sin actualizar) - Para uso avanzado
- `POST /upload/product-image` - Solo sube (sin actualizar) - Para uso avanzado

**¡Ya no necesitas ir a Supabase manualmente!** 🎉

