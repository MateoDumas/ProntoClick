# 🧪 Probar Cloudinary - Guía Rápida

## 📋 Opción 1: Usando Postman (Recomendado)

### Pasos:
1. Abre Postman (o descárgalo si no lo tienes: https://www.postman.com/downloads/)
2. Crea una nueva request:
   - **Method:** `POST`
   - **URL:** `https://prontoclick-backend.onrender.com/upload/product-image`
3. Ve a la pestaña **"Headers"**:
   - Key: `Authorization`
   - Value: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1hdGVvQGdtYWlsLmNvbSIsInN1YiI6IjkwOGEyOWFiLTA1MDgtNDU5NS04ODY0LTFhYjA4NDlhOTM1YiIsImlhdCI6MTc2NzAzMzk3OCwiZXhwIjoxNzY3MDM0ODc4fQ.N-etmWdNfrqfd1_ke5b2-F1TdiKIgcREFDBbvx6OyWA`
4. Ve a la pestaña **"Body"**:
   - Selecciona **"form-data"**
   - Key: `file` (cambia el tipo de "Text" a "File")
   - Value: Selecciona una imagen de tu computadora
5. Haz clic en **"Send"**

### Respuesta Esperada:
```json
{
  "success": true,
  "url": "https://res.cloudinary.com/dvoas1kmw/image/upload/v.../prontoclick/products/...",
  "publicId": "prontoclick/products/..."
}
```

---

## 📋 Opción 2: Usando curl (Terminal)

```bash
curl -X POST https://prontoclick-backend.onrender.com/upload/product-image \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1hdGVvQGdtYWlsLmNvbSIsInN1YiI6IjkwOGEyOWFiLTA1MDgtNDU5NS04ODY0LTFhYjA4NDlhOTM1YiIsImlhdCI6MTc2NzAzMzk3OCwiZXhwIjoxNzY3MDM0ODc4fQ.N-etmWdNfrqfd1_ke5b2-F1TdiKIgcREFDBbvx6OyWA" \
  -F "file=@/ruta/a/tu/imagen.jpg"
```

**Nota:** Reemplaza `/ruta/a/tu/imagen.jpg` con la ruta real de una imagen en tu computadora.

---

## 📋 Opción 3: Usando el Navegador (JavaScript Console)

Abre la consola del navegador (F12) en cualquier página de tu app y pega esto:

```javascript
const formData = new FormData();
const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.accept = 'image/*';
fileInput.onchange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  formData.append('file', file);
  
  try {
    const response = await fetch('https://prontoclick-backend.onrender.com/upload/product-image', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1hdGVvQGdtYWlsLmNvbSIsInN1YiI6IjkwOGEyOWFiLTA1MDgtNDU5NS04ODY0LTFhYjA4NDlhOTM1YiIsImlhdCI6MTc2NzAzMzk3OCwiZXhwIjoxNzY3MDM0ODc4fQ.N-etmWdNfrqfd1_ke5b2-F1TdiKIgcREFDBbvx6OyWA'
      },
      body: formData
    });
    
    const data = await response.json();
    console.log('✅ Respuesta:', data);
    if (data.success) {
      console.log('🖼️ URL de la imagen:', data.url);
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
};
fileInput.click();
```

---

## ✅ Qué Verificar

### 1. En la Respuesta:
- Si ves `"success": true` y una URL de Cloudinary → **¡Funciona!** ✅
- Si ves un error sobre Cloudinary no configurado → Verifica las variables en Render
- Si ves "Unauthorized" → El token expiró, obtén uno nuevo

### 2. En los Logs de Render:
Después de hacer la request, ve a Render → Logs y busca:
- `Cloudinary configurado correctamente` → ✅ Todo bien
- `Cloudinary no está configurado...` → ❌ Verifica variables de entorno

---

## 🆘 Errores Comunes

### ❌ "Cloudinary no está configurado"
- **Solución:** Verifica que las 3 variables estén en Render sin espacios

### ❌ "Unauthorized" (401)
- **Solución:** El token expiró. Obtén uno nuevo haciendo login otra vez

### ❌ "Invalid API Key"
- **Solución:** Verifica que copiaste correctamente el API Key y API Secret

---

## 🎉 Si Funciona

Una vez que tengas la URL de la imagen, puedes:
1. Copiarla
2. Ir a Supabase → Table Editor
3. Seleccionar `Product` o `Restaurant`
4. Editar el campo `image` con la URL
5. Guardar

¡Y listo! La imagen aparecerá en tu aplicación. 🚀

