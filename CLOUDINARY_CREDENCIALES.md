# 🔐 Credenciales Cloudinary - Configuración

## ✅ Credenciales Obtenidas

```
Cloud Name: dvoas1kmw
API Key: 268574242249648
API Secret: _k_G2AoJaohFK-3eZfva-9wxdWM
```

⚠️ **IMPORTANTE:** Estas credenciales son privadas. No las compartas públicamente ni las subas a GitHub.

---

## 📋 Pasos para Configurar en Render

### 1. Ir a Render
1. Ve a: https://dashboard.render.com
2. Inicia sesión si es necesario
3. Selecciona tu servicio **"prontoclick-backend"**

### 2. Agregar Variables de Entorno
1. En el menú lateral, haz clic en **"Environment"**
2. Haz clic en **"Add Environment Variable"**

#### Variable 1: Cloud Name
- **Key:** `CLOUDINARY_CLOUD_NAME`
- **Value:** `dvoas1kmw`
- Haz clic en **"Save Changes"**

#### Variable 2: API Key
- **Key:** `CLOUDINARY_API_KEY`
- **Value:** `268574242249648`
- Haz clic en **"Save Changes"**

#### Variable 3: API Secret
- **Key:** `CLOUDINARY_API_SECRET`
- **Value:** `_k_G2AoJaohFK-3eZfva-9wxdWM`
- Haz clic en **"Save Changes"**

### 3. Reiniciar el Servicio
1. Ve a la pestaña **"Events"** o **"Logs"**
2. Haz clic en **"Manual Deploy"** → **"Deploy latest commit"**
3. O espera a que Render detecte los cambios automáticamente

### 4. Verificar en los Logs
1. Ve a la pestaña **"Logs"**
2. Busca este mensaje:
   ```
   Cloudinary configurado correctamente
   ```
   Si ves este mensaje, ¡está funcionando! ✅

---

## ✅ Checklist

- [ ] Agregué `CLOUDINARY_CLOUD_NAME` en Render
- [ ] Agregué `CLOUDINARY_API_KEY` en Render
- [ ] Agregué `CLOUDINARY_API_SECRET` en Render
- [ ] Reinicié el servicio en Render
- [ ] Verifiqué en los logs que dice "Cloudinary configurado correctamente"

---

## 🎉 ¡Listo!

Una vez configurado, puedes:
- ✅ Subir imágenes desde el frontend
- ✅ Subir imágenes desde el backend usando los endpoints `/upload/*`
- ✅ Las imágenes se optimizan automáticamente
- ✅ Las URLs son públicas y accesibles

---

## 🔒 Seguridad

**IMPORTANTE:** 
- Estas credenciales están guardadas en Render (seguro)
- NO las subas a GitHub
- El archivo `.env` local ya debería estar en `.gitignore`

