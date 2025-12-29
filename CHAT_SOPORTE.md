# Chat de Soporte con IA - ProntoClick

## 📋 Descripción

Sistema de chat en vivo con asistente virtual de IA para soporte al usuario. El chat está diseñado para mantener conversaciones enfocadas únicamente en temas relacionados con ProntoClick.

## ✨ Características

- **Chat en tiempo real** con WebSocket
- **Asistente virtual con IA** (OpenAI opcional)
- **Respuestas predefinidas** como fallback si no hay API key de OpenAI
- **Contexto del usuario**: El asistente conoce los pedidos y reportes del usuario
- **Restricciones estrictas**: El asistente solo responde sobre temas de ProntoClick
- **Historial de conversaciones**: Todas las conversaciones se guardan en la base de datos

## 🚀 Configuración

### 1. Base de Datos

Primero, necesitas ejecutar las migraciones de Prisma para crear las tablas de chat:

```bash
cd Backend
npm run prisma:generate
npm run prisma:migrate
```

O si prefieres hacer un push directo:

```bash
npx prisma db push
```

### 2. Variables de Entorno (Opcional)

Para usar OpenAI, agrega la siguiente variable en tu archivo `.env` del backend:

```env
OPENAI_API_KEY=tu_api_key_aqui
```

**Nota**: Si no configuras `OPENAI_API_KEY`, el sistema usará respuestas predefinidas inteligentes basadas en el contexto del usuario.

### 3. Instalar Dependencias

Las dependencias necesarias ya están incluidas en el proyecto. Si necesitas instalar algo nuevo:

```bash
# Backend
cd Backend
npm install

# Frontend
cd Frontend
npm install socket.io-client
```

## 📁 Estructura

### Backend

```
Backend/Src/chat/
├── chat.service.ts      # Lógica del chat y generación de respuestas IA
├── chat.controller.ts   # Endpoints REST API
├── chat.gateway.ts      # WebSocket Gateway para chat en tiempo real
└── chat.module.ts       # Módulo de NestJS
```

### Frontend

```
Frontend/src/
├── components/chat/
│   └── ChatWidget.tsx   # Componente de chat flotante
└── services/
    └── chat.service.ts  # Servicio para llamadas API
```

## 🔌 Endpoints API

### Crear Sesión
```
POST /chat/sessions
```

### Obtener Sesiones del Usuario
```
GET /chat/sessions
```

### Obtener Sesión Específica
```
GET /chat/sessions/:id
```

### Enviar Mensaje
```
POST /chat/messages
Body: {
  content: string;
  sessionId?: string;
}
```

### Cerrar Sesión
```
POST /chat/sessions/:id/close
```

## 🔌 WebSocket Events

### Cliente → Servidor

- `join_session`: Unirse a una sesión de chat
- `send_message`: Enviar un mensaje
- `leave_session`: Salir de una sesión

### Servidor → Cliente

- `new_message`: Nuevo mensaje recibido
- `connect`: Conexión establecida
- `disconnect`: Desconexión

## 🎯 Funcionalidades del Asistente

El asistente puede ayudar con:

1. **Cómo hacer pedidos**: Guía paso a paso
2. **Estado de pedidos**: Consultar estados y explicar cada uno
3. **Reportes**: Información sobre reportes del usuario
4. **Cupones y promociones**: Cómo usar cupones
5. **ProntoPuntos**: Explicación del sistema de puntos
6. **Pedidos programados**: Cómo programar pedidos
7. **Problemas técnicos**: Guías de uso básicas

## 🛡️ Restricciones de Seguridad

El asistente tiene restricciones estrictas:

- ✅ **Solo responde sobre ProntoClick**
- ❌ **No responde sobre otros temas** (política, deportes, noticias, etc.)
- ✅ **Mantiene contexto del usuario** (pedidos, reportes)
- ✅ **Respuestas breves y útiles**

Si el usuario pregunta algo fuera del contexto, el asistente responderá:
> "Lo siento, solo puedo ayudarte con temas relacionados a ProntoClick. ¿Hay algo sobre la aplicación en lo que pueda ayudarte?"

## 💡 Uso en el Frontend

El componente `ChatWidget` se integra automáticamente en el `MainLayout`, por lo que está disponible en toda la aplicación.

El botón de chat aparece en la esquina inferior izquierda de la pantalla.

## 🔧 Personalización

### Modificar Prompts del Sistema

Edita el método `buildSystemPrompt` en `Backend/Src/chat/chat.service.ts` para personalizar el comportamiento del asistente.

### Agregar Respuestas Predefinidas

Edita el método `getFallbackResponse` en `Backend/Src/chat/chat.service.ts` para agregar más respuestas predefinidas.

### Cambiar Modelo de OpenAI

En `chat.service.ts`, línea donde se hace la llamada a OpenAI, cambia el modelo:

```typescript
model: 'gpt-4', // o 'gpt-3.5-turbo', etc.
```

## 📊 Modelos de Base de Datos

### ChatSession
- `id`: UUID
- `userId`: ID del usuario
- `status`: 'active' | 'closed'
- `createdAt`, `updatedAt`

### ChatMessage
- `id`: UUID
- `sessionId`: ID de la sesión
- `role`: 'user' | 'assistant'
- `content`: Contenido del mensaje
- `metadata`: JSON opcional
- `createdAt`

## 🐛 Solución de Problemas

### El chat no se conecta

1. Verifica que el backend esté corriendo en `http://localhost:3001`
2. Verifica que el token JWT esté en `localStorage`
3. Revisa la consola del navegador para errores

### No hay respuesta del asistente

1. Si usas OpenAI, verifica que la API key sea válida
2. Revisa los logs del backend
3. El sistema debería usar respuestas predefinidas como fallback

### Error de migración

Si hay problemas con las migraciones:

```bash
cd Backend
npx prisma db push --force-reset  # ⚠️ CUIDADO: Esto borra datos
```

O manualmente:

```bash
npx prisma migrate dev --name add_chat_tables
```

## 📝 Notas

- El chat funciona sin OpenAI usando respuestas predefinidas inteligentes
- Todas las conversaciones se guardan en la base de datos
- El WebSocket es opcional, el chat también funciona con HTTP REST
- El asistente tiene acceso al contexto del usuario (pedidos, reportes)

## 🚀 Próximos Pasos

Posibles mejoras futuras:

- [ ] Escalamiento a soporte humano cuando el asistente no puede ayudar
- [ ] Análisis de sentimiento de las conversaciones
- [ ] Sugerencias de respuestas rápidas
- [ ] Integración con sistema de tickets
- [ ] Estadísticas de uso del chat

