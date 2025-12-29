# 🚀 Configuración de APIs - ProntoClick

Esta guía te ayudará a configurar las APIs necesarias para que ProntoClick funcione completamente.

> 📖 **¿No sabes dónde conseguir las API keys?** Revisa la guía detallada: [COMO_OBTENER_API_KEYS.md](./COMO_OBTENER_API_KEYS.md)

## 📍 Google Maps API - ✅ YA CONFIGURADA

**Estado:** ✅ Google Maps API ya está instalada y configurada en el frontend.

### Funcionalidades Disponibles
- ✅ Autocompletado de direcciones
- ✅ Mapa interactivo para seleccionar ubicación
- ✅ Detección automática de ubicación
- ✅ Cálculo de distancia y tiempo de entrega
- ✅ Cálculo dinámico de costo de envío

### Verificar Configuración
Si necesitas verificar o actualizar la API key, está en:
- **Archivo:** `Frontend/.env.local`
- **Variable:** `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

### Costos
- **$200 crédito gratis/mes** (suficiente para desarrollo)
- Luego: ~$7 por cada 1000 cargas de mapa
- **Places API**: $17 por cada 1000 solicitudes

---

## 🔌 Socket.io (WebSocket)

Socket.io ya está configurado. Solo necesitas:

### Backend
El servidor WebSocket se inicia automáticamente con el backend en el puerto 3001.

### Frontend
Asegúrate de que `NEXT_PUBLIC_API_URL` esté configurado en `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Funcionalidades
- ✅ Tracking de pedidos en tiempo real
- ✅ Notificaciones instantáneas
- ✅ Actualizaciones de estado automáticas

---

## 💳 Stripe (Pagos) - ✅ IMPLEMENTADO

**Estado:** ✅ Módulo de pagos implementado y listo para usar.

### 1. Crear cuenta
1. Ve a [Stripe](https://stripe.com/)
2. Crea una cuenta (modo test para desarrollo)
3. Obtén tus API keys desde el Dashboard → Developers → API keys

### 2. Configurar
```env
# Backend/.env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...  # Opcional, para frontend
```

### 3. Endpoints Disponibles

- `POST /payments/create-intent` - Crea un PaymentIntent para procesar pago
- `POST /payments/confirm` - Confirma un pago exitoso

### 4. Uso en Frontend

El sistema valida automáticamente los pagos con tarjeta antes de crear la orden. Si Stripe no está configurado, el sistema permite pagos en efectivo.

**Nota:** Las dependencias ya están instaladas. Solo necesitas configurar las variables de entorno.

---

## 📧 SendGrid (Emails) - ✅ IMPLEMENTADO

**Estado:** ✅ Sistema de notificaciones por email implementado.

### 1. Crear cuenta
1. Ve a [SendGrid](https://sendgrid.com/)
2. Crea una cuenta gratuita (100 emails/día)
3. Verifica tu dominio o usa el modo test
4. Crea un API Key desde Settings → API Keys

### 2. Configurar
```env
# Backend/.env
SENDGRID_API_KEY=SG.xxx
FROM_EMAIL=noreply@prontoclick.com
```

### 3. Emails Automáticos

El sistema envía automáticamente:
- ✅ Email de bienvenida al registrarse
- ✅ Email de confirmación de pedido
- ✅ Email de actualización de estado de pedido

**Nota:** Si SendGrid no está configurado, el sistema funciona normalmente pero no enviará emails. Las dependencias ya están instaladas.

---

## 📱 Twilio (SMS) - Opcional

### 1. Crear cuenta
1. Ve a [Twilio](https://www.twilio.com/)
2. Crea una cuenta (trial gratuito)
3. Obtén Account SID y Auth Token

### 2. Configurar
```env
# Backend/.env
TWILIO_ACCOUNT_SID=ACxxx
TWILIO_AUTH_TOKEN=xxx
TWILIO_PHONE_NUMBER=+1234567890
```

### 3. Instalar
```bash
cd Backend
npm install twilio
```

---

## 🖼️ Cloudinary (Imágenes) - ✅ IMPLEMENTADO

**Estado:** ✅ Sistema de upload y optimización de imágenes implementado.

### 1. Crear cuenta
1. Ve a [Cloudinary](https://cloudinary.com/)
2. Crea una cuenta gratuita
3. Obtén tus credenciales desde el Dashboard

### 2. Configurar
```env
# Backend/.env
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

### 3. Endpoints Disponibles

- `POST /upload/image` - Sube una imagen genérica
- `POST /upload/product-image` - Sube imagen de producto
- `POST /upload/restaurant-image` - Sube imagen de restaurante

### 4. Características

- ✅ Validación de tipo de archivo (solo imágenes)
- ✅ Límite de tamaño (5MB máximo)
- ✅ Optimización automática de imágenes
- ✅ Transformaciones automáticas (resize, calidad, formato)

**Nota:** Las dependencias ya están instaladas. Solo necesitas configurar las variables de entorno.

---

## 🔍 Algolia (Búsqueda Avanzada) - Opcional

### 1. Crear cuenta
1. Ve a [Algolia](https://www.algolia.com/)
2. Crea una cuenta (plan gratuito limitado)
3. Crea un índice

### 2. Configurar
```env
# Backend/.env
ALGOLIA_APP_ID=xxx
ALGOLIA_API_KEY=xxx
ALGOLIA_INDEX_NAME=prontoclick
```

---

## ✅ Checklist de Configuración

### Mínimo Requerido
- [x] Google Maps API Key configurada ✅
- [ ] Backend corriendo en puerto 3001
- [ ] Frontend con variables de entorno configuradas

### Recomendado (Ya Implementado - Solo Configurar)
- [x] Stripe para pagos reales ✅ Implementado
- [x] SendGrid para emails ✅ Implementado
- [x] Cloudinary para optimización de imágenes ✅ Implementado

### Opcional
- [ ] Twilio para SMS
- [ ] Algolia para búsqueda avanzada
- [ ] Firebase para analytics

---

## 🧪 Probar APIs

### Google Maps
1. Abre el checkout o la página de direcciones
2. Deberías ver el autocompletado funcionando
3. El mapa debería cargarse correctamente

### Socket.io
1. Crea un pedido
2. Ve a los detalles del pedido
3. Deberías ver actualizaciones en tiempo real

---

## 📚 Recursos

- [Google Maps API Docs](https://developers.google.com/maps/documentation)
- [Socket.io Docs](https://socket.io/docs/)
- [Stripe Docs](https://stripe.com/docs)
- [SendGrid Docs](https://docs.sendgrid.com/)

---

## 💡 Tips

1. **Desarrollo**: Usa las APIs en modo test/sandbox
2. **Producción**: Configura límites y alertas de uso
3. **Seguridad**: Nunca expongas API keys secretas en el frontend
4. **Costos**: Monitorea el uso en las consolas de cada servicio

