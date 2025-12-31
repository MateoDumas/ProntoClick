# ProntoClick - Backend API

API REST construida con NestJS, TypeScript, Prisma y PostgreSQL.

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+
- PostgreSQL (local) o Supabase (recomendado para producción)
- npm o yarn

### Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp env.example .env
# Editar .env con tus credenciales (ver sección Variables de Entorno)

# Generar cliente de Prisma
npm run prisma:generate

# Ejecutar migraciones
npm run prisma:migrate

# (Opcional) Seedear datos iniciales
npm run seed:all

# Crear usuario de soporte
npm run create:support

# Iniciar en desarrollo
npm run start:dev
```

El servidor estará disponible en `http://localhost:3001`

## 📁 Estructura del Proyecto

```
Backend/
├── Prisma/
│   ├── Schema.prisma           # Schema de base de datos
│   ├── seed.ts                 # Seed principal
│   ├── seed-promotions.ts      # Seed de promociones
│   ├── seed-rewards.ts         # Seed de recompensas
│   ├── seed-coupons.ts         # Seed de cupones
│   ├── create-support-user.ts  # Crear usuario de soporte
│   └── reset-support-password.ts # Reset password de soporte
├── Src/
│   ├── auth/                   # Autenticación (JWT, 2FA)
│   ├── users/                  # Gestión de usuarios
│   ├── restaurants/            # Restaurantes y productos
│   ├── orders/                 # Órdenes y estado
│   ├── market/                 # Marketplace (productos de supermercado)
│   ├── search/                 # Búsqueda avanzada
│   ├── favorites/              # Favoritos
│   ├── promotions/             # Promociones
│   ├── coupons/                # Cupones de descuento
│   ├── reviews/                # Reseñas
│   ├── addresses/              # Direcciones de entrega
│   ├── recommendations/        # Recomendaciones personalizadas
│   ├── rewards/                # Sistema de puntos y recompensas
│   ├── referrals/              # Sistema de referidos
│   ├── saved-lists/            # Listas guardadas
│   ├── reports/                # Reportes y denuncias
│   ├── chat/                   # Chat en tiempo real (WebSocket)
│   ├── support/                # Soporte técnico
│   ├── payments/               # Integración con Stripe
│   ├── notifications/          # Notificaciones por email (SendGrid)
│   ├── upload/                 # Subida de imágenes (Cloudinary)
│   ├── websocket/              # WebSocket Gateway
│   ├── health/                 # Health check endpoint
│   ├── common/                 # Guards, validadores, filtros
│   ├── Prisma/                 # Servicio de Prisma
│   ├── App.module.ts           # Módulo principal
│   └── Main.ts                 # Punto de entrada
└── package.json
```

## 🔌 Endpoints API Principales

### Autenticación (`/auth`)

- `POST /auth/register` - Registrar nuevo usuario
- `POST /auth/login` - Iniciar sesión
- `POST /auth/verify-email` - Verificar email con código
- `POST /auth/resend-verification` - Reenviar código de verificación
- `GET /auth/me` - Obtener usuario actual (requiere JWT)
- `POST /auth/two-factor/generate` - Generar secreto 2FA
- `POST /auth/two-factor/verify-and-enable` - Habilitar 2FA
- `POST /auth/verify-two-factor` - Verificar código 2FA en login
- `POST /auth/two-factor/disable` - Deshabilitar 2FA
- `POST /auth/two-factor/regenerate-backup-codes` - Regenerar códigos de respaldo

### Usuarios (`/users`)

- `GET /users/me` - Obtener perfil del usuario
- `PUT /users/me` - Actualizar perfil
- `POST /users/me/change-password` - Cambiar contraseña
- `DELETE /users/me` - Eliminar cuenta

### Restaurantes (`/restaurants`)

- `GET /restaurants` - Listar todos los restaurantes
- `GET /restaurants/:id` - Obtener restaurante por ID
- `GET /restaurants/:id/products` - Obtener productos de un restaurante

### Marketplace (`/market`)

- `GET /market/categories` - Listar categorías del mercado
- `GET /market/categories/:categoryId/products` - Productos por categoría

### Órdenes (`/orders`)

- `POST /orders` - Crear nueva orden
- `GET /orders` - Listar órdenes del usuario
- `GET /orders/:id` - Obtener orden por ID
- `PATCH /orders/:id/cancel` - Cancelar orden
- `POST /orders/:id/schedule` - Programar orden

### Favoritos (`/favorites`)

- `GET /favorites` - Obtener favoritos del usuario
- `POST /favorites/restaurants/:id` - Agregar restaurante a favoritos
- `DELETE /favorites/restaurants/:id` - Quitar restaurante de favoritos
- `POST /favorites/products/:id` - Agregar producto a favoritos
- `DELETE /favorites/products/:id` - Quitar producto de favoritos

### Promociones (`/promotions`)

- `GET /promotions` - Listar promociones activas
- `GET /promotions/:id` - Obtener promoción por ID

### Cupones (`/coupons`)

- `GET /coupons/available` - Listar cupones disponibles
- `POST /coupons/:code/apply` - Aplicar cupón
- `GET /coupons/my-coupons` - Mis cupones

### Reseñas (`/reviews`)

- `GET /reviews/restaurant/:id` - Obtener reseñas de un restaurante
- `POST /reviews/restaurant/:id` - Crear reseña
- `PUT /reviews/:id` - Actualizar reseña
- `DELETE /reviews/:id` - Eliminar reseña

### Direcciones (`/addresses`)

- `GET /addresses` - Listar direcciones del usuario
- `POST /addresses` - Crear dirección
- `PUT /addresses/:id` - Actualizar dirección
- `DELETE /addresses/:id` - Eliminar dirección
- `PUT /addresses/:id/set-default` - Establecer dirección por defecto

### Recomendaciones (`/recommendations`)

- `GET /recommendations` - Obtener recomendaciones personalizadas
- `GET /recommendations/trending` - Obtener productos/restaurantes trending

### Recompensas (`/rewards`)

- `GET /rewards` - Listar recompensas disponibles
- `GET /rewards/my-rewards` - Mis recompensas
- `POST /rewards/:id/redeem` - Canjear recompensa
- `GET /rewards/points` - Obtener puntos del usuario
- `GET /rewards/point-history` - Historial de puntos

### Referidos (`/referrals`)

- `GET /referrals` - Obtener código de referido
- `GET /referrals/stats` - Estadísticas de referidos

### Listas Guardadas (`/saved-lists`)

- `GET /saved-lists` - Listar listas guardadas
- `POST /saved-lists` - Crear lista
- `PUT /saved-lists/:id` - Actualizar lista
- `DELETE /saved-lists/:id` - Eliminar lista

### Chat (`/chat`)

- `GET /chat/sessions` - Listar sesiones de chat
- `POST /chat/messages` - Enviar mensaje
- `GET /chat/sessions/:sessionId/messages` - Obtener mensajes de sesión

### Soporte (`/support`)

- `GET /support/tickets` - Listar tickets de soporte
- `POST /support/tickets` - Crear ticket
- `GET /support/tickets/:id` - Obtener ticket
- `POST /support/tickets/:id/close` - Cerrar ticket
- `GET /support/surveys` - Listar encuestas de soporte

### Reportes (`/reports`)

- `GET /reports` - Listar reportes del usuario
- `POST /reports` - Crear reporte

### Pagos (`/payments`)

- `POST /payments/create-intent` - Crear intent de pago (Stripe)
- `POST /payments/confirm` - Confirmar pago

### Subida de Archivos (`/upload`)

- `POST /upload/restaurant/:id/image-url` - Subir imagen de restaurante por URL
- `POST /upload/product/:id/image-url` - Subir imagen de producto por URL

### Búsqueda (`/search`)

- `GET /search` - Búsqueda global (restaurantes, productos, etc.)

### Health Check (`/health`)

- `GET /health` - Verificar estado del servidor

## 🔐 Autenticación

La API usa JWT (JSON Web Tokens) para autenticación.

1. Registrar o iniciar sesión para obtener un token
2. Incluir el token en el header: `Authorization: Bearer <token>`
3. Los endpoints protegidos requieren el token válido

### Verificación de Email

Después de registrarse, los usuarios reciben un código de verificación por email. Deben verificar su email antes de poder usar la aplicación completamente.

### Autenticación de Dos Factores (2FA)

Los usuarios pueden habilitar 2FA usando aplicaciones como Google Authenticator o Authy. Se generan códigos de respaldo para recuperación.

### Roles de Usuario

- `user` - Usuario regular (por defecto)
- `support` - Personal de soporte
- `admin` - Administrador

## 🗄️ Base de Datos

El proyecto usa Prisma como ORM. El schema está en `Prisma/Schema.prisma`.

### Modelos Principales

- **User** - Usuarios del sistema (con 2FA, verificación de email, puntos, referidos)
- **Restaurant** - Restaurantes
- **Product** - Productos del menú
- **Order** - Órdenes de pedidos (con estado, programación, penalizaciones)
- **OrderItem** - Items de cada orden
- **Favorite** - Favoritos (restaurantes y productos)
- **Promotion** - Promociones
- **Review** - Reseñas de restaurantes
- **Address** - Direcciones de entrega
- **Coupon** - Cupones de descuento
- **UserCoupon** - Cupones del usuario
- **Reward** - Recompensas disponibles
- **UserReward** - Recompensas canjeadas por usuarios
- **PointTransaction** - Historial de transacciones de puntos
- **Referral** - Sistema de referidos
- **SavedList** - Listas guardadas
- **Report** - Reportes y denuncias
- **ChatSession** - Sesiones de chat
- **ChatMessage** - Mensajes del chat
- **SupportSurvey** - Encuestas de satisfacción de soporte

### Migraciones

```bash
# Crear nueva migración
npm run prisma:migrate

# Ver base de datos en Prisma Studio
npm run prisma:studio

# Generar cliente Prisma (después de cambios en schema)
npm run prisma:generate
```

## 🛠️ Scripts Disponibles

### Desarrollo

- `npm run start:dev` - Desarrollo con hot-reload
- `npm run start:debug` - Desarrollo con debug
- `npm run build` - Compilar para producción
- `npm run start:prod` - Iniciar en producción

### Prisma

- `npm run prisma:generate` - Generar cliente Prisma
- `npm run prisma:migrate` - Ejecutar migraciones
- `npm run prisma:studio` - Abrir Prisma Studio

### Seed Data

- `npm run prisma:seed` - Ejecutar seed principal
- `npm run seed:promotions` - Seed de promociones
- `npm run seed:rewards` - Seed de recompensas
- `npm run seed:coupons` - Seed de cupones
- `npm run seed:all` - Ejecutar todos los seeds

### Usuario de Soporte

- `npm run create:support` - Crear usuario de soporte
- `npm run reset:support` - Reset password de usuario de soporte

### Utilidades

- `npm run pre-deploy` - Verificaciones antes del deploy
- `npm run keep-alive` - Script para mantener vivo el servidor (útil para servicios gratuitos)

## 📝 Variables de Entorno

Crea un archivo `.env` basado en `env.example`. Variables requeridas y opcionales:

### Requeridas

```env
# Base de Datos
DATABASE_URL="postgresql://usuario:contraseña@host:puerto/base_datos?schema=public"

# JWT
JWT_SECRET="secreto-seguro-minimo-32-caracteres"
JWT_EXPIRES_IN="15m"
```

### Opcionales pero Recomendadas

```env
# Servidor
NODE_ENV="development"  # development | production | test
PORT=3001
FRONTEND_URL="http://localhost:3000"  # En producción: https://tu-dominio.com

# SendGrid (Para emails)
SENDGRID_API_KEY="SG.tu_clave_sendgrid"
FROM_EMAIL="noreply@prontoclick.com"

# Stripe (Para pagos)
STRIPE_SECRET_KEY="sk_test_tu_clave_stripe"

# Cloudinary (Para imágenes)
CLOUDINARY_CLOUD_NAME="tu_cloud_name"
CLOUDINARY_API_KEY="tu_api_key"
CLOUDINARY_API_SECRET="tu_api_secret"

# Firebase (Para push notifications - Opcional)
FIREBASE_PROJECT_ID="tu_project_id"
FIREBASE_PRIVATE_KEY="tu_private_key"
FIREBASE_CLIENT_EMAIL="tu_client_email"

# OpenAI (Para chat con IA - Opcional)
OPENAI_API_KEY="sk-tu_clave_openai"
```

### Configuración Recomendada para Producción

- **Base de Datos**: Usar Supabase (PostgreSQL gestionado) o Render PostgreSQL
- **Email**: Configurar SendGrid con dominio verificado
- **Pagos**: Configurar Stripe con claves de producción
- **Imágenes**: Configurar Cloudinary para almacenamiento de imágenes
- **Frontend URL**: Usar HTTPS en producción

## 🚀 Deployment

### Render.com (Recomendado)

1. Conectar repositorio de GitHub
2. Configurar variables de entorno en Render Dashboard
3. Build Command: `npm install && npm run build`
4. Start Command: `npm run start:prod`
5. Root Directory: `Backend`

### Variables de Entorno en Render

Asegúrate de configurar todas las variables requeridas en la sección "Environment" del servicio en Render.

### Health Check

El endpoint `/health` está disponible para verificar el estado del servidor. Render puede usar este endpoint para health checks.

## 🔒 Seguridad

### Implementado

- ✅ Contraseñas hasheadas con bcrypt
- ✅ JWT para autenticación
- ✅ Guards para proteger rutas
- ✅ Validación de datos con class-validator
- ✅ CORS configurado para el frontend
- ✅ Helmet para headers de seguridad HTTP
- ✅ Rate limiting con @nestjs/throttler (100 req/min por IP)
- ✅ Validación de variables de entorno al iniciar
- ✅ Autenticación de dos factores (2FA)
- ✅ Verificación de email
- ✅ Encriptación de datos sensibles

### Mejores Prácticas

- Usar HTTPS en producción
- Generar JWT_SECRET seguro (mínimo 32 caracteres)
- No commitear archivos `.env`
- Rotar secretos regularmente
- Mantener dependencias actualizadas

## 📦 Dependencias Principales

### Core

- **NestJS** - Framework Node.js
- **Prisma** - ORM para base de datos
- **TypeScript** - Lenguaje de programación

### Autenticación

- **@nestjs/passport** - Estrategia de autenticación
- **passport-jwt** - JWT strategy
- **bcrypt** - Hash de contraseñas
- **speakeasy** - Generación de códigos 2FA
- **qrcode** - Generación de QR codes para 2FA

### Base de Datos

- **@prisma/client** - Cliente de Prisma
- **PostgreSQL** - Base de datos

### Comunicación

- **@nestjs/websockets** - WebSockets
- **socket.io** - Socket.io para chat en tiempo real
- **@sendgrid/mail** - Envío de emails

### Pagos e Imágenes

- **stripe** - Procesamiento de pagos
- **cloudinary** - Almacenamiento de imágenes

### Utilidades

- **class-validator** - Validación de DTOs
- **class-transformer** - Transformación de objetos
- **helmet** - Headers de seguridad
- **compression** - Compresión de respuestas
- **@nestjs/throttler** - Rate limiting
- **winston** - Logging estructurado
- **@nestjs/swagger** - Documentación API (Swagger)

## 🌟 Características Implementadas

### Core

- ✅ Autenticación completa (JWT, 2FA, verificación de email)
- ✅ Sistema de usuarios con roles
- ✅ Gestión de restaurantes y productos
- ✅ Sistema de órdenes con estados y programación
- ✅ Marketplace (productos de supermercado)
- ✅ Sistema de búsqueda avanzada

### Experiencia de Usuario

- ✅ Favoritos (restaurantes y productos)
- ✅ Reseñas y calificaciones
- ✅ Direcciones de entrega múltiples
- ✅ Listas guardadas
- ✅ Recomendaciones personalizadas
- ✅ Historial de pedidos

### Gamificación y Recompensas

- ✅ Sistema de puntos (ProntoPuntos)
- ✅ Recompensas canjeables
- ✅ Sistema de referidos
- ✅ Promociones y cupones
- ✅ Historial de transacciones

### Soporte y Comunicación

- ✅ Chat en tiempo real (WebSocket)
- ✅ Sistema de tickets de soporte
- ✅ Encuestas de satisfacción
- ✅ Reportes y denuncias

### Pagos y Facturación

- ✅ Integración con Stripe
- ✅ Procesamiento de pagos
- ✅ Gestión de cupones y descuentos

### Notificaciones

- ✅ Emails transaccionales (SendGrid)
- ✅ Notificaciones push (Firebase - opcional)

### Otros

- ✅ Subida de imágenes (Cloudinary)
- ✅ Health check endpoint
- ✅ Rate limiting
- ✅ Logging estructurado
- ✅ Validación de entorno
- ✅ Documentación Swagger

## 📊 Arquitectura

### Patrón de Diseño

- **MVC** - Model-View-Controller (Controllers, Services, Models)
- **Dependency Injection** - NestJS IoC container
- **Module-based** - Módulos independientes y reutilizables

### Comunicación

- **REST API** - Para operaciones CRUD
- **WebSocket** - Para chat y actualizaciones en tiempo real
- **HTTP/HTTPS** - Protocolo principal

### Base de Datos

- **PostgreSQL** - Base de datos relacional
- **Prisma ORM** - Abstraction layer
- **Migraciones** - Versionado de schema

## 🔍 Debugging y Logs

### Logs

El proyecto usa Winston para logging estructurado. Los logs se muestran en consola y pueden configurarse para escribir en archivos.

### Prisma Studio

```bash
npm run prisma:studio
```

Abre una interfaz web en `http://localhost:5555` para explorar y editar datos directamente.

### Swagger

Si está habilitado, la documentación Swagger está disponible en `/api` (verificar configuración en `Main.ts`).

## 🆘 Solución de Problemas Comunes

### Error de conexión a base de datos

- Verificar `DATABASE_URL` en `.env`
- Verificar que PostgreSQL esté corriendo
- Verificar credenciales y permisos

### Error "JWT_SECRET no configurado"

- Asegúrate de tener `JWT_SECRET` en `.env`
- En producción, debe tener al menos 32 caracteres

### Error al ejecutar migraciones

- Verificar que la base de datos exista
- Verificar permisos del usuario de la base de datos
- Intentar `npm run prisma:generate` antes de migrar

### Error de CORS

- Verificar `FRONTEND_URL` en `.env`
- Asegurarse de que coincida con la URL del frontend

## 📚 Recursos Adicionales

- [Documentación de NestJS](https://docs.nestjs.com/)
- [Documentación de Prisma](https://www.prisma.io/docs)
- [Documentación de SendGrid](https://docs.sendgrid.com/)
- [Documentación de Stripe](https://stripe.com/docs)
- [Documentación de Cloudinary](https://cloudinary.com/documentation)

## 📄 Licencia

Proyecto educativo - ProntoClick

---

**Última actualización**: Diciembre 2024