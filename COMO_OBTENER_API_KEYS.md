# 🔑 Cómo Obtener las API Keys - ProntoClick

Guía paso a paso para obtener las API keys necesarias.

---

## 💳 1. Stripe (Pagos)

### Paso 1: Crear cuenta
1. Ve a: **https://stripe.com/**
2. Click en **"Sign up"** (Registrarse)
3. Completa el formulario con tu email y contraseña
4. Verifica tu email

### Paso 2: Obtener API Keys
1. Una vez dentro del Dashboard, ve a: **Developers → API keys**
2. Verás dos claves:
   - **Publishable key** (pk_test_...) - Para el frontend (opcional)
   - **Secret key** (sk_test_...) - Para el backend (requerida)

### Paso 3: Copiar la Secret Key
1. Click en **"Reveal test key"** para ver la clave secreta
2. Copia la clave que empieza con `sk_test_`
3. Pégala en `Backend/.env`:
   ```env
   STRIPE_SECRET_KEY=sk_test_tu_clave_aqui
   ```

**💰 Costos:** Gratis para desarrollo (modo test). En producción cobran ~2.9% + $0.30 por transacción.

**🔗 Link directo:** https://dashboard.stripe.com/apikeys

---

## 📧 2. SendGrid (Emails)

### Paso 1: Crear cuenta
1. Ve a: **https://sendgrid.com/**
2. Click en **"Start for free"** (Comenzar gratis)
3. Completa el formulario:
   - Email
   - Contraseña
   - Nombre de la empresa
4. Verifica tu email

### Paso 2: Verificar identidad
1. SendGrid te pedirá verificar tu identidad (puede ser por teléfono o documento)
2. Completa el proceso de verificación

### Paso 3: Crear API Key
1. Una vez en el Dashboard, ve a: **Settings → API Keys**
2. Click en **"Create API Key"**
3. Dale un nombre (ej: "ProntoClick Backend")
4. Selecciona permisos: **"Full Access"** o **"Restricted Access"** (solo Mail Send)
5. Click en **"Create & View"**
6. **⚠️ IMPORTANTE:** Copia la API key inmediatamente (solo se muestra una vez)
   - La clave empieza con `SG.`

### Paso 4: Configurar
Pega la clave en `Backend/.env`:
```env
SENDGRID_API_KEY=SG.tu_clave_aqui
FROM_EMAIL=noreply@prontoclick.com
```

**📝 Nota sobre FROM_EMAIL:**
- Para desarrollo, puedes usar cualquier email
- Para producción, necesitas verificar un dominio en SendGrid

**💰 Costos:** Plan gratuito = 100 emails/día. Suficiente para desarrollo.

**🔗 Link directo:** https://app.sendgrid.com/settings/api_keys

---

## 🖼️ 3. Cloudinary (Imágenes)

### Paso 1: Crear cuenta
1. Ve a: **https://cloudinary.com/**
2. Click en **"Sign Up for Free"** (Registrarse gratis)
3. Completa el formulario:
   - Email
   - Contraseña
   - Nombre
4. Verifica tu email

### Paso 2: Obtener credenciales
1. Una vez en el Dashboard, verás tu **Cloud Name** (arriba a la izquierda)
2. Ve a: **Settings** (icono de engranaje) → **Security**
3. Ahí encontrarás:
   - **Cloud Name** (ej: "dxyz1234")
   - **API Key** (ej: "123456789012345")
   - **API Secret** (click en "Reveal" para verla)

### Paso 3: Configurar
Agrega las credenciales en `Backend/.env`:
```env
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

**💰 Costos:** Plan gratuito incluye:
- 25 GB de almacenamiento
- 25 GB de ancho de banda/mes
- Transformaciones ilimitadas

**🔗 Link directo:** https://console.cloudinary.com/settings/security

---

## 📋 Resumen de Variables de Entorno

Crea o edita el archivo `Backend/.env` con todas las claves:

```env
# Stripe
STRIPE_SECRET_KEY=sk_test_tu_clave_stripe

# SendGrid
SENDGRID_API_KEY=SG.tu_clave_sendgrid
FROM_EMAIL=noreply@prontoclick.com

# Cloudinary
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

---

## ✅ Verificar que Funciona

Después de configurar las variables de entorno:

1. **Reinicia el servidor backend:**
   ```bash
   cd Backend
   npm run start:dev
   ```

2. **Revisa los logs:**
   - Si ves "Stripe configurado correctamente" → ✅ Stripe OK
   - Si ves "SendGrid configurado correctamente" → ✅ SendGrid OK
   - Si ves "Cloudinary configurado correctamente" → ✅ Cloudinary OK

3. **Si no están configuradas:**
   - Verás warnings pero el sistema seguirá funcionando
   - Solo las funcionalidades específicas no estarán disponibles

---

## 🆘 Problemas Comunes

### Stripe
- **Error:** "Stripe no está configurado"
  - Verifica que `STRIPE_SECRET_KEY` empiece con `sk_test_` o `sk_live_`
  - Asegúrate de no tener espacios extra en el `.env`

### SendGrid
- **Error:** "SendGrid no está configurado"
  - Verifica que `SENDGRID_API_KEY` empiece con `SG.`
  - Asegúrate de haber copiado la clave completa

### Cloudinary
- **Error:** "Cloudinary no está configurado"
  - Verifica que las 3 variables estén configuradas
  - Asegúrate de que el API Secret sea el correcto (click en "Reveal")

---

## 💡 Tips

1. **Desarrollo:** Usa siempre las claves de **test/sandbox** (no las de producción)
2. **Seguridad:** Nunca subas el archivo `.env` a Git (debe estar en `.gitignore`)
3. **Pruebas:** Empieza con una API a la vez para verificar que funciona
4. **Costos:** Todas tienen planes gratuitos suficientes para desarrollo

---

**¿Necesitas ayuda?** Revisa la documentación oficial de cada servicio o los logs del servidor.

