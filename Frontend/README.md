# ProntoClick - Frontend

Aplicación web de delivery de comida construida con Next.js, TypeScript, Tailwind CSS y React Query.

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+
- npm o yarn
- Backend API corriendo (ver `../Backend/README.md`)

### Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
# Crear archivo .env.local con NEXT_PUBLIC_API_URL

# Ejecutar en desarrollo
npm run dev

# Build para producción
npm run build

# Iniciar en producción
npm start
```

La aplicación estará disponible en `http://localhost:3000`

## 📁 Estructura del Proyecto

```
Frontend/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── addresses/      # Gestión de direcciones
│   │   ├── auth/           # Rutas protegidas (ProtectedRoute, SupportRoute)
│   │   ├── cart/           # Componentes del carrito
│   │   ├── chat/           # Widget de chat en tiempo real
│   │   ├── coupons/        # Gestión de cupones
│   │   ├── favorites/      # Botón de favoritos
│   │   ├── layout/         # Layout (Navbar, Footer, MainLayout, UserMenu)
│   │   ├── maps/           # Integración con Google Maps
│   │   ├── market/         # Marketplace (categorías y productos)
│   │   ├── orders/         # Componentes de órdenes y seguimiento
│   │   ├── promotions/     # Promociones destacadas
│   │   ├── referrals/      # Sistema de referidos
│   │   ├── reports/        # Reportes y denuncias
│   │   ├── restaurants/    # Restaurantes (cards, menús, categorías)
│   │   ├── reviews/        # Reseñas y calificaciones
│   │   ├── rewards/        # Sistema de puntos y recompensas
│   │   ├── search/         # Búsqueda y filtros avanzados
│   │   ├── support/        # Soporte técnico (chat viewer, encuestas)
│   │   └── ui/             # Componentes UI base (Button, Input, Modal, Toast, etc.)
│   ├── contexts/           # Contextos React
│   │   ├── GoogleMapsContext.tsx    # Contexto de Google Maps
│   │   ├── ThemeContext.tsx         # Contexto de tema (modo oscuro/claro)
│   │   └── HolidayContext.tsx       # Contexto de festividades temáticas
│   ├── hooks/              # Custom hooks
│   │   ├── useAuth.ts              # Hooks de autenticación
│   │   ├── useCartAnimation.ts     # Animaciones del carrito
│   │   ├── useOrderAlerts.ts       # Alertas de órdenes
│   │   ├── useSocket.ts            # WebSocket para órdenes
│   │   ├── useToast.ts             # Sistema de notificaciones
│   │   └── useHolidayStyles.ts     # Estilos de festividades
│   ├── pages/              # Páginas de Next.js
│   │   ├── _app.tsx        # Configuración de la app
│   │   ├── _document.tsx   # Configuración del documento HTML
│   │   ├── index.tsx       # Home
│   │   ├── login.tsx       # Login
│   │   ├── register.tsx    # Registro
│   │   ├── verify-email.tsx # Verificación de email
│   │   ├── restaurants.tsx # Lista de restaurantes
│   │   ├── restaurants/[id].tsx # Detalle de restaurante
│   │   ├── market/[id].tsx # Categorías de mercado
│   │   ├── checkout.tsx    # Checkout
│   │   ├── payment.tsx     # Pago
│   │   ├── orders.tsx      # Historial de pedidos
│   │   ├── orders/[id].tsx # Detalle de pedido
│   │   ├── favorites.tsx   # Favoritos
│   │   ├── profile.tsx     # Perfil de usuario (dashboard con tabs)
│   │   ├── addresses.tsx   # Direcciones
│   │   ├── promotions.tsx  # Promociones
│   │   ├── rewards.tsx     # Recompensas y puntos
│   │   ├── recommendations.tsx # Recomendaciones
│   │   ├── saved-lists.tsx # Listas guardadas
│   │   ├── search.tsx      # Búsqueda
│   │   ├── support/dashboard.tsx # Dashboard de soporte
│   │   ├── about.tsx       # Sobre nosotros
│   │   ├── terms.tsx       # Términos y condiciones
│   │   └── privacy.tsx     # Política de privacidad
│   ├── services/           # Servicios API
│   │   ├── auth.service.ts        # Autenticación
│   │   ├── user.service.ts        # Usuarios
│   │   ├── restaurant.service.ts  # Restaurantes
│   │   ├── order.service.ts       # Órdenes
│   │   ├── market.service.ts      # Marketplace
│   │   ├── favorites.service.ts   # Favoritos
│   │   ├── promotion.service.ts   # Promociones
│   │   ├── coupon.service.ts      # Cupones
│   │   ├── review.service.ts      # Reseñas
│   │   ├── address.service.ts     # Direcciones
│   │   ├── recommendation.service.ts # Recomendaciones
│   │   ├── reward.service.ts      # Recompensas
│   │   ├── referral.service.ts    # Referidos
│   │   ├── saved-list.service.ts  # Listas guardadas
│   │   ├── report.service.ts      # Reportes
│   │   ├── chat.service.ts        # Chat
│   │   ├── support.service.ts     # Soporte
│   │   ├── payment.service.ts     # Pagos
│   │   ├── two-factor.service.ts  # Autenticación de dos factores
│   │   └── api.ts                 # Cliente HTTP base (Axios)
│   ├── stores/             # Estado global (Zustand)
│   │   ├── cart.store.ts   # Estado del carrito
│   │   └── user.store.ts   # Estado del usuario
│   ├── types/              # Tipos TypeScript
│   │   ├── index.ts        # Tipos principales
│   │   ├── user.ts         # Tipos de usuario
│   │   ├── restaurant.ts   # Tipos de restaurante
│   │   ├── product.ts      # Tipos de producto
│   │   ├── order.ts        # Tipos de orden
│   │   ├── promotion.ts    # Tipos de promoción
│   │   └── market.ts       # Tipos de mercado
│   ├── utils/              # Utilidades
│   │   ├── maps.ts         # Utilidades de mapas
│   │   ├── sounds.ts       # Sonidos del sistema
│   │   └── holidays.ts     # Sistema de festividades
│   ├── styles/             # Estilos
│   │   └── globals.css     # Estilos globales y Tailwind
│   └── mocks/              # Datos mock (fallback)
│       ├── restaurants.mock.ts
│       ├── menu.mock.ts
│       ├── orders.mock.ts
│       └── market.mock.ts
├── public/                 # Archivos estáticos
│   └── images/
├── tailwind.config.js      # Configuración de Tailwind
├── tsconfig.json           # Configuración de TypeScript
└── package.json
```

## 🎨 Componentes Principales

### UI Components (`components/ui/`)

- **Button** - Botón con variantes (primary, secondary, outline, danger) y temas de festividades
- **Input** - Input con label, validación y modo oscuro
- **Modal** - Modal reutilizable
- **Loader** - Spinner de carga
- **Toast/ToastContainer** - Sistema de notificaciones
- **ThemeToggle** - Toggle de modo oscuro/claro

### Layout Components (`components/layout/`)

- **MainLayout** - Layout principal con Navbar y Footer
- **Navbar** - Navegación con búsqueda, menú de usuario y temas de festividades
- **Footer** - Footer con enlaces, newsletter y redes sociales
- **UserMenu** - Menú desplegable del usuario

### Feature Components

#### Restaurantes (`components/restaurants/`)
- **RestaurantCard** - Card de restaurante con rating y descripción
- **MenuItemCard** - Card de producto del menú
- **CategoryTabs** - Tabs para filtrar por categoría con temas de festividades

#### Marketplace (`components/market/`)
- **MarketCategories** - Categorías del marketplace
- **MarketProductCard** - Card de producto del mercado

#### Órdenes (`components/orders/`)
- **LiveOrderTracking** - Seguimiento en tiempo real de órdenes
- **OrderTracking** - Timeline de estados del pedido
- **CancelOrderModal** - Modal para cancelar órdenes
- **ConnectionStatus** - Indicador de conexión WebSocket

#### Carrito (`components/cart/`)
- **CartFloating** - Carrito flotante con sidebar
- **CartItem** - Item individual del carrito
- **CartSummary** - Resumen del carrito con totales

#### Reseñas (`components/reviews/`)
- **ReviewsSection** - Sección completa de reseñas
- **ReviewCard** - Card individual de reseña
- **ReviewForm** - Formulario para crear/editar reseñas

#### Chat y Soporte (`components/chat/`, `components/support/`)
- **ChatWidget** - Widget de chat en tiempo real
- **ChatViewer** - Visualizador de chat para soporte
- **SurveyModal** - Modal de encuesta de satisfacción

#### Otros
- **SearchBar** - Barra de búsqueda global
- **AdvancedFilters** - Filtros avanzados
- **PromotionCard** - Card de promoción
- **RewardCard** - Card de recompensa
- **ReferralCard** - Card de referidos
- **FavoriteButton** - Botón de favoritos
- **PointsDisplay** - Display de puntos del usuario
- **AddressCard** - Card de dirección
- **AddressForm** - Formulario de direcciones

## 🗺️ Rutas y Páginas

### Públicas

- `/` - Home con restaurantes destacados, categorías de mercado y promociones
- `/restaurants` - Lista de restaurantes con búsqueda y filtros
- `/restaurants/[id]` - Detalle de restaurante con menú y reseñas
- `/market/[id]` - Productos de una categoría del mercado
- `/promotions` - Lista de promociones activas
- `/search` - Búsqueda global
- `/about` - Sobre nosotros
- `/terms` - Términos y condiciones
- `/privacy` - Política de privacidad

### Autenticación

- `/login` - Login con soporte para 2FA
- `/register` - Registro de nuevos usuarios
- `/verify-email` - Verificación de email con código

### Protegidas (requieren autenticación)

- `/checkout` - Checkout con dirección y método de pago
- `/payment` - Proceso de pago
- `/orders` - Historial de pedidos
- `/orders/[id]` - Detalle de pedido con seguimiento en tiempo real
- `/favorites` - Restaurantes y productos favoritos
- `/profile` - Perfil de usuario (tabs: perfil, contraseña, reportes, cuenta/2FA)
- `/addresses` - Gestión de direcciones de entrega
- `/rewards` - Sistema de puntos y recompensas
- `/recommendations` - Recomendaciones personalizadas
- `/saved-lists` - Listas guardadas
- `/support/dashboard` - Dashboard de soporte (solo rol support)

## 🔐 Autenticación

### Características

- ✅ Login con email y contraseña
- ✅ Registro con validación de email
- ✅ Verificación de email con código
- ✅ Autenticación de dos factores (2FA) con Google Authenticator/Authy
- ✅ Códigos de respaldo para 2FA
- ✅ Manejo de tokens JWT
- ✅ Interceptores de API para agregar tokens automáticamente
- ✅ Protección de rutas (ProtectedRoute, SupportRoute)
- ✅ Logout automático en caso de token inválido

### Flujo de Autenticación

1. Usuario se registra → Recibe código de verificación por email
2. Usuario verifica email → Puede usar la aplicación
3. Usuario puede habilitar 2FA desde su perfil
4. En login con 2FA habilitado → Se solicita código 2FA
5. Token JWT se almacena en localStorage
6. Todas las peticiones incluyen el token automáticamente

## 🛒 Carrito de Compras

El carrito utiliza Zustand para el estado global:

- Agregar productos (restaurantes y mercado)
- Remover productos
- Actualizar cantidades
- Calcular totales (subtotal, envío, descuentos, total)
- Aplicar cupones
- Validar mínimo de pedido
- Persistencia durante la sesión
- Carrito flotante siempre visible
- Animaciones al agregar productos

## 🎨 Sistema de Temas

### Modo Oscuro

- Toggle en el Navbar
- Preferencia guardada en localStorage
- Soporte completo en todos los componentes
- Transiciones suaves
- Colores optimizados para legibilidad

### Sistema de Festividades

La aplicación cambia automáticamente su tema según festividades:

- **Navidad** (1-31 diciembre)
- **Año Nuevo** (31 dic - 2 enero)
- **Día de Reyes** (3-8 enero)
- **San Valentín** (10-16 febrero)
- **Pascua** (fecha variable)
- **Día de la Madre** (mayo, variable)
- **Día del Padre** (junio, variable)
- **Día de la Independencia** (7-12 julio)
- **Halloween** (25 oct - 2 nov)

Cada festividad incluye:
- Gradientes de colores únicos
- Emojis decorativos animados
- Decoraciones en hero sections
- Temas aplicados a botones, títulos y componentes

## 🔄 Estado Global

### Zustand Stores

- **cart.store.ts** - Estado del carrito
- **user.store.ts** - Estado del usuario

### React Query (TanStack Query)

Usado para:
- Caché de datos del servidor
- Sincronización automática
- Estados de carga y error
- Invalidación de caché
- Optimistic updates

## 🌐 WebSocket

Integración con Socket.io para:

- **Órdenes en tiempo real**: Actualizaciones de estado de pedidos
- **Chat en tiempo real**: Mensajería con soporte
- **Seguimiento de entregas**: Ubicación del repartidor
- **Notificaciones instantáneas**: Alertas de cambios

## 📱 Características Principales

### Restaurantes y Menú

- Lista de restaurantes con búsqueda y filtros
- Detalle de restaurante con información completa
- Menú organizado por categorías
- Filtros por categoría, precio, rating
- Sistema de favoritos

### Marketplace

- Categorías de productos (tecnología, almacén, etc.)
- Productos con información detallada
- Búsqueda dentro de categorías
- Agregar productos al carrito

### Órdenes

- Crear órdenes desde restaurantes o mercado
- Historial completo de pedidos
- Seguimiento en tiempo real con WebSocket
- Estados: pendiente, confirmado, preparando, listo, entregado, cancelado
- Programación de órdenes
- Cancelación de órdenes

### Sistema de Puntos y Recompensas

- **ProntoPuntos**: Gana 1 punto por cada $1 gastado
- **Recompensas**: Canjea puntos por recompensas
- **Referidos**: Gana puntos por referir amigos
- **Historial**: Ver todas las transacciones de puntos

### Promociones y Cupones

- Lista de promociones activas
- Aplicar cupones en el checkout
- Cupones de bienvenida (una vez)
- Descuentos automáticos

### Reseñas

- Ver reseñas de restaurantes
- Crear y editar reseñas propias
- Calificaciones con estrellas
- Comentarios y fechas

### Direcciones

- Múltiples direcciones guardadas
- Dirección por defecto
- Integración con Google Maps
- Autocompletado de direcciones
- Validación de ubicación

### Perfil de Usuario

Dashboard con 4 tabs:
- **Perfil**: Editar nombre, email, avatar
- **Contraseña**: Cambiar contraseña
- **Reportes**: Ver reportes creados
- **Cuenta**: Gestión de 2FA, códigos de respaldo, eliminar cuenta

### Chat y Soporte

- Chat en tiempo real con soporte
- Widget flotante siempre disponible
- Encuestas de satisfacción
- Dashboard de soporte para personal autorizado

### Búsqueda

- Búsqueda global (restaurantes, productos)
- Filtros avanzados
- Resultados en tiempo real
- Historial de búsquedas

### Recomendaciones

- Recomendaciones personalizadas basadas en historial
- Restaurantes trending
- Productos populares

### Listas Guardadas

- Crear listas personalizadas
- Agregar productos a listas
- Compartir listas
- Gestión completa de listas

## 🎯 Variables de Entorno

Crea un archivo `.env.local`:

```env
# URL del backend API
NEXT_PUBLIC_API_URL=http://localhost:3001

# En producción, usar la URL de tu backend desplegado
# NEXT_PUBLIC_API_URL=https://tu-backend.render.com
```

## 🛠️ Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo en puerto 3000
- `npm run build` - Crea el build optimizado de producción
- `npm run start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta el linter de ESLint
- `npm test` - Ejecuta las pruebas (si están configuradas)

## 📦 Dependencias Principales

### Core

- **Next.js 14** - Framework React con SSR/SSG
- **React 18** - Biblioteca UI
- **TypeScript** - Tipado estático

### Estilos

- **Tailwind CSS** - Framework CSS utility-first
- **Autoprefixer** - PostCSS para compatibilidad

### Estado y Datos

- **@tanstack/react-query** - Manejo de estado del servidor y caché
- **Zustand** - Estado global ligero
- **Axios** - Cliente HTTP con interceptores

### Integraciones

- **@react-google-maps/api** - Integración con Google Maps
- **socket.io-client** - Cliente WebSocket para tiempo real

## 🎨 Diseño y UX

### Características de Diseño

- **Paleta de colores**: Rojo como primario (con temas de festividades)
- **Gradientes modernos**: Efectos visuales atractivos
- **Glassmorphism**: Efectos de vidrio esmerilado
- **Sombras y bordes**: Diseño moderno y suave
- **Animaciones**: Transiciones suaves y efectos
- **Responsive**: Diseño completamente adaptable
- **Modo oscuro**: Soporte completo con colores optimizados
- **Temas de festividades**: Cambio automático según fechas

### Experiencia de Usuario

- Loading states en todas las operaciones
- Error handling con mensajes claros
- Toasts para feedback de acciones
- Confirmaciones para acciones críticas
- Optimistic updates donde aplica
- Infinite scroll en listas largas
- Lazy loading de imágenes
- Animaciones al agregar al carrito

## 🚀 Deployment

### Vercel (Recomendado)

1. Conectar repositorio de GitHub
2. Configurar variables de entorno:
   - `NEXT_PUBLIC_API_URL` - URL del backend
3. Deploy automático en cada push

### Build Manual

```bash
npm run build
npm start
```

El build optimizado estará en `.next/`

## 🔒 Seguridad

### Implementado

- ✅ Tokens JWT almacenados en localStorage
- ✅ Interceptores para agregar tokens automáticamente
- ✅ Protección de rutas (ProtectedRoute, SupportRoute)
- ✅ Validación de roles (support, admin)
- ✅ Sanitización de inputs
- ✅ HTTPS en producción
- ✅ CORS configurado en backend

### Mejores Prácticas

- No exponer tokens en URLs
- Validar datos del servidor
- Manejar errores de autenticación
- Logout automático en errores 401

## 📱 Responsive Design

La aplicación está completamente optimizada para:

- **Desktop**: Experiencia completa con sidebar y múltiples columnas
- **Tablet**: Layout adaptado con navegación optimizada
- **Mobile**: Diseño móvil-first con navegación touch-friendly

Breakpoints de Tailwind:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## 🔄 Flujo de Usuario Típico

1. **Explorar**: Usuario navega restaurantes o mercado en el home
2. **Buscar**: Puede buscar productos/restaurantes específicos
3. **Ver detalles**: Selecciona un restaurante/producto y ve detalles
4. **Agregar al carrito**: Agrega productos al carrito
5. **Checkout**: Va a checkout, completa dirección y aplica cupones
6. **Pagar**: Procesa el pago
7. **Seguir pedido**: Ve el estado del pedido en tiempo real
8. **Calificar**: Puede dejar reseña después de recibir el pedido
9. **Ganar puntos**: Acumula puntos para recompensas

## 🆘 Solución de Problemas Comunes

### Error de conexión al backend

- Verificar `NEXT_PUBLIC_API_URL` en `.env.local`
- Verificar que el backend esté corriendo
- Verificar CORS en el backend

### Error de autenticación

- Verificar que el token esté en localStorage
- Intentar hacer logout y login nuevamente
- Verificar que el token no haya expirado

### Estilos no se aplican

- Ejecutar `npm run dev` nuevamente
- Limpiar caché del navegador
- Verificar que Tailwind esté configurado correctamente

### WebSocket no conecta

- Verificar que el backend tenga WebSocket habilitado
- Verificar la URL del backend
- Revisar la consola para errores específicos

## 📚 Recursos Adicionales

- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Tailwind CSS](https://tailwindcss.com/docs)
- [Documentación de React Query](https://tanstack.com/query/latest)
- [Documentación de Zustand](https://docs.pmnd.rs/zustand)
- [Documentación de Google Maps API](https://developers.google.com/maps/documentation)

## 📄 Licencia

Proyecto educativo - ProntoClick

---

**Última actualización**: Diciembre 2024
