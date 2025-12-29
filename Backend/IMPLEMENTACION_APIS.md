# 🚀 APIs Implementadas - ProntoClick

Este documento describe las APIs externas que han sido implementadas en el backend.

## ✅ APIs Implementadas

### 1. 💳 Stripe (Pagos)

**Módulo:** `Backend/Src/payments/`

**Funcionalidades:**
- Creación de PaymentIntents para procesar pagos con tarjeta
- Confirmación de pagos
- Validación automática antes de crear órdenes

**Endpoints:**
- `POST /payments/create-intent` - Crea un PaymentIntent
- `POST /payments/confirm` - Confirma un pago

**Integración:**
- Integrado en `OrdersService` para validar pagos antes de crear órdenes
- Si Stripe no está configurado, permite pagos en efectivo

**Variables de entorno requeridas:**
```env
STRIPE_SECRET_KEY=sk_test_...
```

---

### 2. 📧 SendGrid (Emails)

**Módulo:** `Backend/Src/notifications/`

**Funcionalidades:**
- Email de bienvenida al registrarse
- Email de confirmación de pedido
- Email de actualización de estado de pedido

**Integración:**
- `AuthService` - Envía email de bienvenida
- `OrdersService` - Envía emails de confirmación y actualización

**Variables de entorno requeridas:**
```env
SENDGRID_API_KEY=SG.xxx
FROM_EMAIL=noreply@prontoclick.com
```

**Nota:** Si SendGrid no está configurado, el sistema funciona normalmente pero no enviará emails.

---

### 3. 🖼️ Cloudinary (Imágenes)

**Módulo:** `Backend/Src/upload/`

**Funcionalidades:**
- Upload de imágenes con validación
- Optimización automática (resize, calidad, formato)
- Organización por carpetas (products, restaurants)
- Eliminación de imágenes

**Endpoints:**
- `POST /upload/image` - Sube imagen genérica
- `POST /upload/product-image` - Sube imagen de producto
- `POST /upload/restaurant-image` - Sube imagen de restaurante

**Características:**
- Validación de tipo (solo imágenes: jpeg, png, webp, gif)
- Límite de tamaño: 5MB máximo
- Transformaciones automáticas para optimización

**Variables de entorno requeridas:**
```env
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
```

---

## 🔧 Configuración

Todas las APIs están implementadas y listas para usar. Solo necesitas:

1. **Crear cuentas** en los servicios correspondientes
2. **Obtener las API keys**
3. **Agregar las variables de entorno** en `Backend/.env`
4. **Reiniciar el servidor**

## 📝 Notas Importantes

- **Todas las APIs son opcionales**: El sistema funciona sin ellas, pero con funcionalidad limitada
- **Manejo de errores**: Si una API no está configurada, el sistema continúa funcionando
- **Logs**: Los errores se registran en la consola pero no bloquean operaciones críticas

## 🧪 Probar las APIs

### Stripe
1. Configura `STRIPE_SECRET_KEY` en `.env`
2. Crea un pedido con método de pago "card"
3. El sistema validará el pago automáticamente

### SendGrid
1. Configura `SENDGRID_API_KEY` y `FROM_EMAIL` en `.env`
2. Registra un nuevo usuario → Recibirás email de bienvenida
3. Crea un pedido → Recibirás email de confirmación

### Cloudinary
1. Configura las credenciales de Cloudinary en `.env`
2. Usa el endpoint `/upload/image` para subir imágenes
3. Las imágenes se optimizarán automáticamente

---

**Última actualización:** Diciembre 2024

