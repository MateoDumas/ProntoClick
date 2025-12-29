# ProntoClick - Frontend

Aplicación web de delivery de comida construida con Next.js, TypeScript, Tailwind CSS y React Query.

## 🚀 Características

### Funcionalidades Principales
- **Home**: Lista de restaurantes con diseño moderno y responsive
- **Detalle de Restaurante**: Menú completo con categorías y productos
- **Carrito de Compras**: Sidebar flotante con gestión de items
- **Checkout**: Formulario completo de dirección y método de pago
- **Autenticación**: Login y Register con validación
- **Mis Pedidos**: Historial completo con timeline de estados
- **Detalles de Pedido**: Vista detallada con seguimiento en tiempo real

### Tecnologías

- **Next.js 14** - Framework React con SSR
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utility-first
- **React Query (TanStack Query)** - Manejo de estado del servidor
- **Zustand** - Estado global del carrito
- **Axios** - Cliente HTTP con interceptores

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Build para producción
npm run build

# Iniciar en producción
npm start
```

## 🏗️ Estructura del Proyecto

```
Frontend/
├── src/
│   ├── components/       # Componentes reutilizables
│   │   ├── cart/        # Componentes del carrito
│   │   ├── layout/      # Layout principal (Navbar, Footer)
│   │   ├── restaurants/ # Componentes de restaurantes
│   │   └── ui/          # Componentes UI base (Button, Input, etc.)
│   ├── hooks/           # Custom hooks
│   ├── pages/           # Páginas de Next.js
│   ├── services/        # Servicios API
│   ├── stores/          # Estado global (Zustand)
│   ├── types/           # Tipos TypeScript
│   └── styles/          # Estilos globales
├── public/              # Archivos estáticos
└── package.json
```

## 🎨 Componentes Principales

### UI Components
- `Button` - Botón con variantes (primary, secondary, outline)
- `Input` - Input con label y validación
- `Loader` - Spinner de carga reutilizable
- `Toast` - Sistema de notificaciones

### Layout Components
- `MainLayout` - Layout principal con Navbar y Footer
- `Navbar` - Navegación con estado de autenticación
- `Footer` - Footer con enlaces y información

### Feature Components
- `RestaurantCard` - Card de restaurante
- `MenuItemCard` - Card de producto del menú
- `CategoryTabs` - Tabs para filtrar por categoría
- `CartFloating` - Carrito flotante con sidebar

## 🔐 Autenticación

El sistema de autenticación incluye:
- Login con email y contraseña
- Registro de nuevos usuarios
- Manejo de tokens JWT
- Interceptores de API para agregar tokens automáticamente
- Protección de rutas

## 🛒 Carrito de Compras

El carrito utiliza Zustand para el estado global:
- Agregar productos
- Remover productos
- Actualizar cantidades
- Calcular totales
- Persistencia durante la sesión

## 📱 Páginas

- `/` - Home con lista de restaurantes
- `/restaurants/[id]` - Detalle de restaurante con menú
- `/checkout` - Formulario de checkout
- `/login` - Página de login
- `/register` - Página de registro
- `/orders` - Historial de pedidos
- `/orders/[id]` - Detalles de un pedido específico

## 🎯 Variables de Entorno

Crea un archivo `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 🚦 Estado de las Rutas

- ✅ Home
- ✅ Detalle de Restaurante
- ✅ Carrito
- ✅ Checkout
- ✅ Login/Register
- ✅ Mis Pedidos
- ✅ Detalles de Pedido

## 🎨 Diseño

El diseño utiliza:
- Paleta de colores azul como primario
- Gradientes modernos
- Sombras y bordes suaves
- Animaciones y transiciones
- Diseño completamente responsive

## 📝 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Crea el build de producción
- `npm run start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta el linter

## 🔄 Flujo de Usuario

1. Usuario navega restaurantes en el home
2. Selecciona un restaurante y ve el menú
3. Agrega productos al carrito
4. Va a checkout y completa el formulario
5. Confirma el pedido
6. Ve el estado del pedido en "Mis Pedidos"
7. Puede ver detalles y timeline del pedido

## 🛠️ Próximas Mejoras

- [ ] Búsqueda y filtros de restaurantes
- [ ] Perfil de usuario
- [ ] Reseñas y calificaciones
- [ ] Notificaciones push
- [ ] Modo oscuro
- [ ] Internacionalización (i18n)

## 📄 Licencia

Este proyecto es parte de ProntoClick.

