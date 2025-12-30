# 🚀 Configurar Cloudinary - Paso a Paso

## 📋 Paso 1: Obtener tus Credenciales

### 1.1 Ve al Dashboard
1. En la barra lateral izquierda, haz clic en **"Home"** (icono de casa)
2. O ve directamente a: https://console.cloudinary.com/console

### 1.2 Encontrar tus Credenciales
1. En el Dashboard, busca la sección **"Account Details"** o **"Product Environment Credentials"**
2. Verás tres valores importantes:
   - **Cloud Name** (ej: `dabc123`)
   - **API Key** (ej: `123456789012345`)
   - **API Secret** (ej: `abcdefghijklmnopqrstuvwxyz`)

   ⚠️ **IMPORTANTE:** El API Secret es privado, no lo compartas públicamente.

### 1.3 Copiar las Credenciales
Copia estos tres valores y guárdalos temporalmente (en un bloc de notas):
```
Cloud Name: [tu_cloud_name]
API Key: [tu_api_key]
API Secret: [tu_api_secret]
```

---

## 📋 Paso 2: Configurar en Render (Backend)

### 2.1 Ir a Render
1. Ve a: https://dashboard.render.com
2. Selecciona tu servicio **"prontoclick-backend"**

### 2.2 Agregar Variables de Entorno
1. En el menú lateral, haz clic en **"Environment"**
2. Haz clic en **"Add Environment Variable"**
3. Agrega estas **3 variables** una por una:

   **Variable 1:**
   - **Key:** `CLOUDINARY_CLOUD_NAME`
   - **Value:** [Pega tu Cloud Name]
   - Haz clic en **"Save Changes"**

   **Variable 2:**
   - **Key:** `CLOUDINARY_API_KEY`
   - **Value:** [Pega tu API Key]
   - Haz clic en **"Save Changes"**

   **Variable 3:**
   - **Key:** `CLOUDINARY_API_SECRET`
   - **Value:** [Pega tu API Secret]
   - Haz clic en **"Save Changes"**

### 2.3 Reiniciar el Servicio
1. Ve a la pestaña **"Events"** o **"Logs"**
2. Haz clic en **"Manual Deploy"** → **"Deploy latest commit"**
3. O simplemente espera a que Render detecte los cambios y reinicie automáticamente

---

## 📋 Paso 3: Verificar que Funciona

### 3.1 Verificar en los Logs
1. En Render, ve a **"Logs"**
2. Busca un mensaje que diga:
   ```
   Cloudinary configurado correctamente
   ```
   Si ves este mensaje, ¡está funcionando! ✅

### 3.2 Probar Subir una Imagen (Opcional)

**Opción A: Usando Postman o Insomnia**
1. Obtén un JWT token (haz login en tu app)
2. Crea una request:
   - **Method:** `POST`
   - **URL:** `https://prontoclick-backend.onrender.com/upload/product-image`
   - **Headers:**
     - `Authorization: Bearer TU_JWT_TOKEN`
   - **Body:** 
     - Tipo: `form-data`
     - Campo: `file` (tipo File)
     - Selecciona una imagen
3. Envía la request
4. Deberías recibir una respuesta como:
   ```json
   {
     "success": true,
     "url": "https://res.cloudinary.com/.../prontoclick/products/...",
     "publicId": "prontoclick/products/..."
   }
   ```

**Opción B: Usando el Componente Frontend**
1. Usa el componente `ImageUpload` que creamos
2. Está en: `Frontend/src/components/admin/ImageUpload.tsx`

---

## 📋 Paso 4: Actualizar Imágenes en la Base de Datos

Una vez que tengas las URLs de las imágenes, puedes actualizarlas en Supabase:

### 4.1 Opción Manual (Supabase Dashboard)
1. Ve a tu proyecto en Supabase
2. **Table Editor** → Selecciona `Restaurant` o `Product`
3. Edita el campo `image` con la URL de Cloudinary
4. Guarda

### 4.2 Opción Script (Automático)
```bash
cd Backend
ts-node Prisma/update-image-url.ts product "product-id" "https://res.cloudinary.com/..."
```

---

## ✅ Checklist de Verificación

- [ ] Creé cuenta en Cloudinary
- [ ] Obtuve mis 3 credenciales (Cloud Name, API Key, API Secret)
- [ ] Agregué las 3 variables en Render
- [ ] Reinicié el servicio en Render
- [ ] Verifiqué en los logs que dice "Cloudinary configurado correctamente"
- [ ] Probé subir una imagen (opcional)

---

## 🆘 Problemas Comunes

### ❌ "Cloudinary no está configurado"
- **Solución:** Verifica que las 3 variables estén correctamente escritas en Render (sin espacios extra)

### ❌ "Invalid API Key"
- **Solución:** Verifica que copiaste correctamente el API Key y API Secret desde Cloudinary

### ❌ "Unauthorized"
- **Solución:** Verifica que estás enviando el JWT token en el header `Authorization`

### ❌ El servicio no reinicia
- **Solución:** Haz un "Manual Deploy" desde Render

---

## 🎉 ¡Listo!

Una vez configurado, puedes:
- ✅ Subir imágenes desde el frontend usando el componente `ImageUpload`
- ✅ Subir imágenes desde el backend usando los endpoints `/upload/*`
- ✅ Las imágenes se optimizan automáticamente
- ✅ Las URLs son públicas y accesibles desde cualquier lugar

---

## 📞 ¿Necesitas Ayuda?

Si tienes problemas:
1. Revisa los logs en Render
2. Verifica que las variables estén correctamente escritas
3. Asegúrate de que el servicio se haya reiniciado después de agregar las variables

¡Éxito! 🚀

