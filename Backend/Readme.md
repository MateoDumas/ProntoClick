# ProntoClick - Backend API

API REST construida con NestJS, TypeScript, Prisma y PostgreSQL.

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+
- PostgreSQL
- npm o yarn

### Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de base de datos

# Generar cliente de Prisma
npm run prisma:generate

# Ejecutar migraciones
npm run prisma:migrate

# Iniciar en desarrollo
npm run start:dev
```

El servidor estará disponible en `http://localhost:3001`

## 📁 Estructura

```
Backend/
├── Prisma/
│   └── Schema.prisma      # Schema de base de datos
├── Src/
│   ├── auth/              # Módulo de autenticación
│   ├── users/             # Módulo de usuarios
│   ├── restaurants/       # Módulo de restaurantes
│   ├── orders/            # Módulo de órdenes
│   ├── Prisma/            # Servicio de Prisma
│   ├── common/            # Guards y utilidades
│   ├── App.module.ts      # Módulo principal
│   └── Main.ts            # Punto de entrada
└── package.json
```

## 🔌 Endpoints API

### Autenticación

- `POST /auth/register` - Registrar nuevo usuario
- `POST /auth/login` - Iniciar sesión
- `GET /auth/me` - Obtener usuario actual (requiere JWT)

### Restaurantes

- `GET /restaurants` - Listar todos los restaurantes
- `GET /restaurants/:id` - Obtener restaurante por ID
- `GET /restaurants/:id/products` - Obtener productos de un restaurante

### Órdenes (requiere autenticación)

- `POST /orders` - Crear nueva orden
- `GET /orders` - Listar órdenes del usuario
- `GET /orders/:id` - Obtener orden por ID

## 🔐 Autenticación

La API usa JWT (JSON Web Tokens) para autenticación.

1. Registrar o iniciar sesión para obtener un token
2. Incluir el token en el header: `Authorization: Bearer <token>`
3. Los endpoints protegidos requieren el token válido

## 🗄️ Base de Datos

El proyecto usa Prisma como ORM. El schema está en `Prisma/Schema.prisma`.

### Modelos

- **User** - Usuarios del sistema
- **Restaurant** - Restaurantes
- **Product** - Productos del menú
- **Order** - Órdenes de pedidos
- **OrderItem** - Items de cada orden

### Migraciones

```bash
# Crear nueva migración
npm run prisma:migrate

# Ver base de datos en Prisma Studio
npm run prisma:studio
```

## 🛠️ Scripts

- `npm run start:dev` - Desarrollo con hot-reload
- `npm run build` - Compilar para producción
- `npm run start:prod` - Iniciar en producción
- `npm run prisma:generate` - Generar cliente Prisma
- `npm run prisma:migrate` - Ejecutar migraciones
- `npm run prisma:studio` - Abrir Prisma Studio

## 📝 Variables de Entorno

Crea un archivo `.env` con:

```env
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="15m"
PORT=3001
FRONTEND_URL="http://localhost:3000"
```

## 🔒 Seguridad

- Contraseñas hasheadas con bcrypt
- JWT para autenticación
- Guards para proteger rutas
- Validación de datos con class-validator
- CORS configurado para el frontend

## 📦 Dependencias Principales

- **NestJS** - Framework Node.js
- **Prisma** - ORM para base de datos
- **Passport JWT** - Estrategia de autenticación
- **bcrypt** - Hash de contraseñas
- **class-validator** - Validación de DTOs

## 🚦 Estado

- ✅ Autenticación completa
- ✅ Módulo de usuarios
- ✅ Módulo de restaurantes
- ✅ Módulo de órdenes
- ✅ Schema de base de datos
- ✅ Guards y validación

## 📄 Licencia

Proyecto educativo - ProntoClick

