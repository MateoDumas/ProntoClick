# ProntoClick 🚀

Aplicación de delivery de comida rápida con sistema de chat inteligente, soporte al cliente y programa de recompensas.

## 🛠️ Tecnologías

### Backend
- **NestJS** - Framework Node.js
- **Prisma** - ORM para PostgreSQL
- **PostgreSQL** - Base de datos (Supabase)
- **WebSocket** - Comunicación en tiempo real
- **JWT** - Autenticación
- **OpenAI** - Chatbot inteligente

### Frontend
- **Next.js** - Framework React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos
- **Socket.io Client** - WebSocket cliente

## 📋 Características

- ✅ Sistema de autenticación (usuarios, soporte, admin)
- ✅ Catálogo de restaurantes y productos
- ✅ Sistema de pedidos
- ✅ Chatbot inteligente con IA
- ✅ Sistema de soporte al cliente
- ✅ Dashboard de soporte
- ✅ Encuestas de satisfacción
- ✅ Sistema de reportes
- ✅ Puntos y recompensas
- ✅ Cupones y promociones

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+ 
- PostgreSQL (o cuenta de Supabase)
- Cuenta de OpenAI (para el chatbot)

### Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/MateoDumas/ProntoClick.git
cd ProntoClick
```

2. **Backend**
```bash
cd Backend
npm install
cp .env.example .env
# Editar .env con tus credenciales
npm run prisma:generate
npm run start:dev
```

3. **Frontend**
```bash
cd Frontend
npm install
cp .env.example .env.local
# Editar .env.local con tu API_BASE
npm run dev
```

## 📚 Documentación

La documentación detallada está en proceso de consolidación.  
Por ahora, este README recoge los pasos principales para levantar el entorno de desarrollo.

## 🔐 Variables de Entorno

### Backend (.env)
```env
DATABASE_URL="postgresql://..."
JWT_SECRET="tu-secret-key"
OPENAI_API_KEY="tu-openai-key"
NODE_ENV="development"
PORT=3001
```

### Frontend (.env.local)
```env
API_BASE="http://localhost:3001"
NEXT_PUBLIC_API_BASE="http://localhost:3001"
```

## 📝 Scripts

### Backend
- `npm run start:dev` - Desarrollo
- `npm run build` - Build de producción
- `npm run start:prod` - Producción
- `npm run prisma:generate` - Generar Prisma Client
- `npm run prisma:migrate` - Ejecutar migraciones

### Frontend
- `npm run dev` - Desarrollo
- `npm run build` - Build de producción
- `npm run start` - Producción

## 🧪 Testing

```bash
# Backend
cd Backend
npm run test

# Frontend
cd Frontend
npm run test
```

## 📦 Deployment

Para producción puedes:
- Desplegar el **Backend** en cualquier proveedor que soporte Node.js y PostgreSQL/Supabase.
- Desplegar el **Frontend** en Vercel u otra plataforma para apps Next.js.

Asegúrate de configurar correctamente las variables de entorno para el entorno de producción.

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es privado.

## 👥 Autores

- Mateo Dumas

---

**ProntoClick** - Delivery rápido y eficiente 🍔🚴
