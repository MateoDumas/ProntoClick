# 📮 Cómo Usar Postman - Guía Rápida

## 📥 Paso 1: Descargar Postman

### Opción A: Postman Desktop (Recomendado)
1. Ve a: https://www.postman.com/downloads/
2. Haz clic en **"Download the Desktop App"**
3. Selecciona tu sistema operativo (Windows/Mac/Linux)
4. Descarga e instala el archivo

### Opción B: Postman Web (Sin Instalar)
1. Ve a: https://web.postman.com/
2. Crea una cuenta gratuita o inicia sesión
3. Puedes usarlo directamente en el navegador

---

## 🚀 Paso 2: Abrir Postman

### Si lo Descargaste:
1. Busca "Postman" en el menú de inicio de Windows
2. O busca el icono de Postman en tu escritorio
3. Haz doble clic para abrirlo

### Si Usas la Versión Web:
1. Ve a: https://web.postman.com/
2. Inicia sesión

---

## 📋 Paso 3: Crear tu Primera Request

1. **Crea una nueva request:**
   - Haz clic en **"New"** (arriba a la izquierda)
   - Selecciona **"HTTP Request"**
   - O presiona `Ctrl + N` (Windows) / `Cmd + N` (Mac)

2. **Configura la request:**
   - **Method:** Cambia a `POST` (dropdown a la izquierda)
   - **URL:** Pega: `https://prontoclick-backend.onrender.com/upload/product-image`

3. **Agrega el Header de Autorización:**
   - Ve a la pestaña **"Headers"**
   - Key: `Authorization`
   - Value: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1hdGVvQGdtYWlsLmNvbSIsInN1YiI6IjkwOGEyOWFiLTA1MDgtNDU5NS04ODY0LTFhYjA4NDlhOTM1YiIsImlhdCI6MTc2NzAzMzk3OCwiZXhwIjoxNzY3MDM0ODc4fQ.N-etmWdNfrqfd1_ke5b2-F1TdiKIgcREFDBbvx6OyWA`
   - ✅ Marca la casilla para activarlo

4. **Agrega el archivo:**
   - Ve a la pestaña **"Body"**
   - Selecciona **"form-data"**
   - Key: `file` (cambia el tipo de "Text" a **"File"** usando el dropdown)
   - Value: Haz clic en **"Select Files"** y elige una imagen

5. **Envía la request:**
   - Haz clic en el botón **"Send"** (arriba a la derecha)

---

## 📸 Capturas de Pantalla (Referencia)

### Interfaz de Postman:
```
┌─────────────────────────────────────────┐
│  POST  [URL aquí]              [Send]   │
├─────────────────────────────────────────┤
│  Params | Authorization | Headers | ... │
├─────────────────────────────────────────┤
│  Body                                   │
│  ○ none  ○ form-data  ○ x-www-form... │
│                                         │
│  Key    Value    Type                   │
│  file   [Select] [File ▼]              │
└─────────────────────────────────────────┘
```

---

## ✅ Respuesta Esperada

Si todo funciona, deberías ver algo como:

```json
{
  "success": true,
  "url": "https://res.cloudinary.com/dvoas1kmw/image/upload/v.../prontoclick/products/...",
  "publicId": "prontoclick/products/..."
}
```

---

## 🆘 Problemas Comunes

### ❌ "No se puede conectar"
- Verifica tu conexión a internet
- Verifica que la URL sea correcta

### ❌ "Unauthorized" (401)
- El token expiró, obtén uno nuevo
- Verifica que el header `Authorization` esté correctamente escrito

### ❌ "Cloudinary no está configurado"
- Verifica las variables de entorno en Render

---

## 🎯 Alternativa: Usar el Navegador (Más Rápido)

Si no quieres instalar Postman, puedes usar el código JavaScript que te di antes directamente en la consola del navegador. Es más rápido para una prueba rápida.

---

## 📝 Resumen Rápido

1. **Descarga Postman:** https://www.postman.com/downloads/
2. **Abre Postman**
3. **Nueva Request:** `Ctrl + N`
4. **Method:** `POST`
5. **URL:** `https://prontoclick-backend.onrender.com/upload/product-image`
6. **Headers:** `Authorization: Bearer [tu_token]`
7. **Body:** `form-data` → `file` (tipo File) → Selecciona imagen
8. **Send**

¡Listo! 🚀

