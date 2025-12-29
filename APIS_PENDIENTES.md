# 📋 APIs Pendientes de Configurar

## ✅ Ya Configuradas
- ✅ **Google Maps API** - Ya instalada y funcionando

---

## ⚠️ Pendientes de Configurar

### 1. 💳 Stripe (Pagos)
**Prioridad:** 🔴 Alta

**Link directo:** https://dashboard.stripe.com/apikeys

**Pasos:**
1. Crear cuenta en Stripe
2. Ir a Developers → API keys
3. Copiar la `Secret key` (sk_test_...)
4. Agregar en `Backend/.env`:
   ```env
   STRIPE_SECRET_KEY=sk_test_tu_clave_aqui
   ```

**¿Por qué es importante?**
- Permite procesar pagos reales con tarjeta
- Sin esto, solo funcionan pagos en efectivo

---

### 2. 📧 SendGrid (Emails)
**Prioridad:** 🟡 Media

**Link directo:** https://app.sendgrid.com/settings/api_keys

**Pasos:**
1. Crear cuenta en SendGrid (gratis, 100 emails/día)
2. Ir a Settings → API Keys
3. Crear nueva API Key
4. Copiar la clave (SG.xxx)
5. Agregar en `Backend/.env`:
   ```env
   SENDGRID_API_KEY=SG.tu_clave_aqui
   FROM_EMAIL=noreply@prontoclick.com
   ```

**¿Por qué es importante?**
- Envía emails de bienvenida al registrarse
- Envía confirmaciones de pedido
- Envía actualizaciones de estado

**Nota:** Sin esto, el sistema funciona pero no envía emails.

---

### 3. 🖼️ Cloudinary (Imágenes)
**Prioridad:** 🟡 Media

**Link directo:** https://console.cloudinary.com/settings/security

**Pasos:**
1. Crear cuenta en Cloudinary (gratis)
2. Ir a Settings → Security
3. Copiar:
   - Cloud Name
   - API Key
   - API Secret (click en "Reveal")
4. Agregar en `Backend/.env`:
   ```env
   CLOUDINARY_CLOUD_NAME=tu_cloud_name
   CLOUDINARY_API_KEY=tu_api_key
   CLOUDINARY_API_SECRET=tu_api_secret
   ```

**¿Por qué es importante?**
- Permite subir imágenes de productos
- Optimiza automáticamente las imágenes
- Almacena imágenes en la nube

**Nota:** Sin esto, no podrás subir imágenes desde la app.

---

## 🚀 Orden Recomendado de Configuración

1. **Primero:** Stripe (pagos reales)
2. **Segundo:** SendGrid (emails importantes)
3. **Tercero:** Cloudinary (imágenes)

---

## 📝 Archivo .env Completo

Después de obtener todas las claves, tu `Backend/.env` debería verse así:

```env
# Base de Datos
DATABASE_URL="postgresql://..."

# JWT
JWT_SECRET="tu_secret_key"
JWT_EXPIRES_IN="15m"

# Servidor
PORT=3001
FRONTEND_URL="http://localhost:3000"

# Stripe (Pagos)
STRIPE_SECRET_KEY=sk_test_tu_clave_stripe

# SendGrid (Emails)
SENDGRID_API_KEY=SG.tu_clave_sendgrid
FROM_EMAIL=noreply@prontoclick.com

# Cloudinary (Imágenes)
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

---

## ✅ Verificar Configuración

Después de agregar las variables de entorno:

1. **Reinicia el servidor backend:**
   ```bash
   cd Backend
   npm run start:dev
   ```

2. **Revisa los logs:**
   - ✅ "Stripe configurado correctamente"
   - ✅ "SendGrid configurado correctamente"
   - ✅ "Cloudinary configurado correctamente"

3. **Si ves warnings:**
   - Las APIs no están configuradas pero el sistema seguirá funcionando
   - Solo las funcionalidades específicas no estarán disponibles

---

## 📚 Más Información

- **Guía detallada:** [COMO_OBTENER_API_KEYS.md](./COMO_OBTENER_API_KEYS.md)
- **Links directos:** [LINKS_API_KEYS.md](./LINKS_API_KEYS.md)
- **Documentación técnica:** [Backend/IMPLEMENTACION_APIS.md](./Backend/IMPLEMENTACION_APIS.md)

