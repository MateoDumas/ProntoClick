# 🔐 Configurar Variables de Entorno en Producción

## ⚠️ IMPORTANTE: Por qué `.env.local` NO se sube a GitHub

El archivo `.env.local` está en `.gitignore` por **seguridad**. Esto significa:
- ✅ **NO se sube a GitHub** (correcto, por seguridad)
- ✅ **Solo funciona en tu computadora local**
- ❌ **NO funciona en Vercel/Render automáticamente**

## 🎯 Solución: Configurar Variables en las Plataformas

Debes configurar las variables de entorno **directamente en Vercel y Render**.

---

## 📍 VERCEL (Frontend)

### Paso 1: Ir a la Configuración del Proyecto

1. Ve a https://vercel.com
2. Inicia sesión
3. Selecciona tu proyecto **ProntoClick**
4. Ve a **Settings** → **Environment Variables**

### Paso 2: Agregar Variables

Haz clic en **"Add New"** y agrega cada variable:

#### Variables OBLIGATORIAS:

```
NEXT_PUBLIC_API_URL=https://prontoclick-backend.onrender.com
```

#### Variables OPCIONALES (si las necesitas):

```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyDI1Q_6uBUVRRNB6P_BvgQGA0bWtoxM8uk
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Paso 3: Seleccionar Entornos

Para cada variable, selecciona en qué entornos aplicará:
- ✅ **Production** (producción)
- ✅ **Preview** (previews de PRs)
- ✅ **Development** (desarrollo local, opcional)

### Paso 4: Guardar y Redeployar

1. Haz clic en **"Save"**
2. Vercel hará un **nuevo deploy automáticamente**
3. Espera ~2-3 minutos

### 📸 Imagen de Referencia:

```
Settings → Environment Variables
┌─────────────────────────────────────┐
│ Add New                             │
├─────────────────────────────────────┤
│ Name: NEXT_PUBLIC_API_URL           │
│ Value: https://prontoclick-...      │
│ Environments: ☑ Production          │
│              ☑ Preview              │
│              ☐ Development           │
│ [Save]                              │
└─────────────────────────────────────┘
```

---

## 🖥️ RENDER (Backend)

### Paso 1: Ir a la Configuración del Servicio

1. Ve a https://render.com
2. Inicia sesión
3. Selecciona tu servicio **prontoclick-backend**
4. Ve a **Environment**

### Paso 2: Agregar Variables

Haz clic en **"+ Add Environment Variable"** y agrega cada variable:

#### Variables OBLIGATORIAS:

```
NODE_ENV=production
DATABASE_URL=postgresql://postgres:...@aws-1-us-east-2.pooler.supabase.com:5432/postgres?sslmode=require
JWT_SECRET=tu-secreto-super-seguro-de-al-menos-32-caracteres
JWT_EXPIRES_IN=15m
PORT=3001
FRONTEND_URL=https://tu-app.vercel.app
```

#### Variables OPCIONALES (si las necesitas):

```
SENDGRID_API_KEY=SG.tu_clave_sendgrid
FROM_EMAIL=noreply@prontoclick.com
STRIPE_SECRET_KEY=sk_test_...
OPENAI_API_KEY=sk-tu-clave-openai
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

### Paso 3: Guardar

1. Haz clic en **"Save Changes"**
2. Render hará un **redeploy automático**
3. Espera ~3-5 minutos

### 📸 Imagen de Referencia:

```
Environment
┌─────────────────────────────────────┐
│ + Add Environment Variable          │
├─────────────────────────────────────┤
│ Key: NODE_ENV                       │
│ Value: production                   │
│ [Save Changes]                      │
├─────────────────────────────────────┤
│ Key: DATABASE_URL                    │
│ Value: postgresql://...              │
│ [Save Changes]                      │
└─────────────────────────────────────┘
```

---

## ✅ Verificación

### Después de Configurar:

1. **Espera 2-5 minutos** para que ambos servicios redeployen
2. **Limpia la caché del navegador** (Ctrl+Shift+R)
3. **Abre tu app en Vercel**
4. **Abre la consola del navegador** (F12)
5. Verifica que:
   - Las requests van a la URL correcta del backend
   - No hay errores de CORS
   - Google Maps funciona (si lo configuraste)

---

## 🔍 Troubleshooting

### Error: "NEXT_PUBLIC_API_URL is not defined"

**Solución:**
1. Ve a Vercel → Settings → Environment Variables
2. Verifica que `NEXT_PUBLIC_API_URL` esté configurada
3. Verifica que esté marcada para **Production**
4. Haz un nuevo deploy manual si es necesario

### Error: "Google Maps no funciona"

**Solución:**
1. Ve a Vercel → Settings → Environment Variables
2. Agrega `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` con tu API key
3. Verifica que esté marcada para **Production**
4. Haz un nuevo deploy

### Error: CORS

**Solución:**
1. Ve a Render → Environment
2. Verifica que `FRONTEND_URL` sea exactamente la URL de Vercel
3. Sin espacios, sin barras al final
4. Ejemplo: `https://prontoclick.vercel.app` (no `https://prontoclick.vercel.app/`)

---

## 📋 Checklist de Variables

### Vercel (Frontend):
- [ ] `NEXT_PUBLIC_API_URL` → URL del backend en Render
- [ ] `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` → Tu API key de Google Maps
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` → (Opcional) Si usas Stripe

### Render (Backend):
- [ ] `NODE_ENV` → `production`
- [ ] `DATABASE_URL` → URL de Supabase
- [ ] `JWT_SECRET` → Secreto seguro de 32+ caracteres
- [ ] `JWT_EXPIRES_IN` → `15m`
- [ ] `PORT` → `3001`
- [ ] `FRONTEND_URL` → URL de Vercel
- [ ] `SENDGRID_API_KEY` → (Opcional) Si usas emails
- [ ] `STRIPE_SECRET_KEY` → (Opcional) Si usas pagos

---

## 💡 Tips Importantes

1. **NUNCA** subas `.env.local` a GitHub (ya está en `.gitignore`)
2. **Siempre** configura las variables en las plataformas de deployment
3. **Verifica** que las variables estén marcadas para **Production**
4. **Espera** a que redeployen después de agregar variables
5. **Limpia la caché** del navegador después de cambios

---

## 🔗 Enlaces Útiles

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Render Dashboard:** https://dashboard.render.com
- **Guía completa de deployment:** `/DEPLOYMENT_VERCEL_FRONTEND.md`
- **Variables de Render:** `/VARIABLES_RENDER.md`

---

**¡Configura las variables en ambas plataformas y tu app funcionará en producción!** 🚀
