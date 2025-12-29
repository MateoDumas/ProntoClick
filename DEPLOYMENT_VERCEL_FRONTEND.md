# 🚀 Guía: Deploy Frontend en Vercel

## ✅ Prerrequisitos

- ✅ Backend funcionando en Render: `https://prontoclick-backend.onrender.com`
- ✅ Repositorio en GitHub: `https://github.com/MateoDumas/ProntoClick`

---

## 📋 Paso 1: Crear Cuenta en Vercel

1. Ve a https://vercel.com
2. Haz clic en **"Sign Up"**
3. Elige **"Continue with GitHub"**
4. Autoriza Vercel para acceder a tu repositorio

---

## 📋 Paso 2: Importar Proyecto

1. En el dashboard de Vercel, haz clic en **"Add New..."** → **"Project"**
2. Busca y selecciona el repositorio **"ProntoClick"**
3. Haz clic en **"Import"**

---

## 📋 Paso 3: Configurar el Proyecto

### Configuración Básica:

- **Framework Preset:** `Next.js` (debería detectarse automáticamente)
- **Root Directory:** `Frontend` ⚠️ **IMPORTANTE**
- **Build Command:** `npm run build` (o déjalo vacío, Vercel lo detecta)
- **Output Directory:** `.next` (o déjalo vacío)
- **Install Command:** `npm install` (o déjalo vacío)

---

## 📋 Paso 4: Variables de Entorno

Haz clic en **"Environment Variables"** y agrega:

### Variable Obligatoria:

```
NEXT_PUBLIC_API_BASE=https://prontoclick-backend.onrender.com
```

**Nota:** En Next.js, las variables que empiezan con `NEXT_PUBLIC_` son accesibles en el cliente.

### Variables Opcionales (si las necesitas):

```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=tu_clave_google_maps
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=tu_clave_stripe_publica
```

---

## 📋 Paso 5: Deploy

1. Haz clic en **"Deploy"**
2. Espera ~2-3 minutos
3. Vercel te dará una URL como: `https://prontoclick.vercel.app`

---

## 📋 Paso 6: Actualizar FRONTEND_URL en Render

1. Ve a Render → Tu servicio backend
2. Settings → Environment
3. Actualiza `FRONTEND_URL` con la URL de Vercel:
   ```
   FRONTEND_URL=https://prontoclick.vercel.app
   ```
4. Render redeployará automáticamente

---

## ✅ Verificación

1. Abre la URL de Vercel en tu navegador
2. La aplicación debería cargar
3. Prueba hacer login o cualquier funcionalidad
4. Verifica que se conecte con el backend

---

## 🔧 Troubleshooting

### Error: "Module not found"
- Verifica que **Root Directory** sea `Frontend`
- Asegúrate de que `package.json` esté en `Frontend/`

### Error: "API connection failed"
- Verifica que `NEXT_PUBLIC_API_BASE` esté configurada correctamente
- Verifica que el backend esté funcionando en Render
- Revisa la consola del navegador para ver errores de CORS

### CORS Error
- Verifica que `FRONTEND_URL` en Render coincida con la URL de Vercel
- El backend debería permitir requests desde Vercel

---

## 📝 Resumen de URLs

- **Backend:** `https://prontoclick-backend.onrender.com`
- **Frontend:** `https://prontoclick.vercel.app` (o la URL que te dé Vercel)
- **Health Check:** `https://prontoclick-backend.onrender.com/health`

---

**¡Sigue estos pasos y tu frontend estará en línea!** 🎉

