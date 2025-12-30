# ✅ Verificar que Cloudinary Funciona

## 📋 Paso 1: Verificar en los Logs de Render

1. Ve a Render: https://dashboard.render.com
2. Selecciona tu servicio **"prontoclick-backend"**
3. Ve a la pestaña **"Logs"**
4. Busca este mensaje:
   ```
   Cloudinary configurado correctamente
   ```
   
   ✅ Si ves este mensaje, **¡está funcionando!**

   ❌ Si no lo ves, espera unos segundos o haz un "Manual Deploy"

---

## 📋 Paso 2: Probar Subir una Imagen

Tienes **3 formas** de probar:

### Opción A: Usando Postman o Insomnia (Recomendado para pruebas)

1. **Obtener un JWT Token:**
   - Ve a tu frontend: https://pronto-click.vercel.app
   - Haz login
   - Abre la consola del navegador (F12)
   - Ve a **Application** → **Local Storage**
   - Busca `token` y copia el valor

2. **Crear Request en Postman:**
   - **Method:** `POST`
   - **URL:** `https://prontoclick-backend.onrender.com/upload/product-image`
   - **Headers:**
     ```
     Authorization: Bearer TU_JWT_TOKEN_AQUI
     ```
   - **Body:**
     - Selecciona **"form-data"**
     - Key: `file` (tipo: File)
     - Value: Selecciona una imagen de tu computadora
   - Haz clic en **"Send"**

3. **Respuesta esperada:**
   ```json
   {
     "success": true,
     "url": "https://res.cloudinary.com/dvoas1kmw/image/upload/v.../prontoclick/products/...",
     "publicId": "prontoclick/products/..."
   }
   ```

### Opción B: Usando curl (Terminal)

```bash
curl -X POST https://prontoclick-backend.onrender.com/upload/product-image \
  -H "Authorization: Bearer TU_JWT_TOKEN" \
  -F "file=@/ruta/a/tu/imagen.jpg"
```

### Opción C: Desde el Frontend (Usando el Componente)

El componente `ImageUpload` ya está creado en:
- `Frontend/src/components/admin/ImageUpload.tsx`

Puedes usarlo en cualquier página de administración.

---

## 📋 Paso 3: Actualizar Imágenes en la Base de Datos

Una vez que tengas la URL de la imagen (del paso 2), puedes actualizarla en Supabase:

### Opción A: Manual (Supabase Dashboard)
1. Ve a tu proyecto en Supabase
2. **Table Editor** → Selecciona `Restaurant` o `Product`
3. Edita el campo `image` con la URL de Cloudinary
4. Guarda

### Opción B: Script Automático
```bash
cd Backend
ts-node Prisma/update-image-url.ts product "product-id" "https://res.cloudinary.com/..."
```

---

## 🎯 Endpoints Disponibles

Tu backend ya tiene estos endpoints listos:

### 1. Subir Imagen de Producto
```
POST /upload/product-image
Headers: Authorization: Bearer JWT_TOKEN
Body: form-data con campo "file"
```

### 2. Subir Imagen de Restaurante
```
POST /upload/restaurant-image
Headers: Authorization: Bearer JWT_TOKEN
Body: form-data con campo "file"
```

### 3. Subir Imagen Genérica
```
POST /upload/image
Headers: Authorization: Bearer JWT_TOKEN
Body: form-data con campo "file"
```

---

## ✅ Checklist de Verificación

- [ ] Verifiqué en los logs que dice "Cloudinary configurado correctamente"
- [ ] Probé subir una imagen usando Postman/curl
- [ ] Recibí una respuesta con `success: true` y una URL
- [ ] La URL de la imagen es accesible (puedo abrirla en el navegador)
- [ ] Actualicé una imagen en la base de datos (opcional)

---

## 🆘 Problemas Comunes

### ❌ "Cloudinary no está configurado"
- **Solución:** Verifica que las 3 variables estén correctamente escritas en Render (sin espacios extra)

### ❌ "Invalid API Key"
- **Solución:** Verifica que copiaste correctamente el API Key y API Secret

### ❌ "Unauthorized" (401)
- **Solución:** Verifica que estás enviando el JWT token en el header `Authorization`

### ❌ El servicio no reinicia
- **Solución:** Haz un "Manual Deploy" desde Render

---

## 🎉 ¡Listo!

Una vez que veas "Cloudinary configurado correctamente" en los logs, **¡ya está funcionando!**

Puedes empezar a subir imágenes y actualizar tu base de datos. 🚀

