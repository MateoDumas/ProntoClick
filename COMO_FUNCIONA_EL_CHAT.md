# 🤖 ¿Cómo Funciona el Chat de Soporte?

## 📋 Tipo de Sistema

Es un **chatbot híbrido inteligente** con dos modos de operación:

### 1. **Modo IA (Opcional - OpenAI)**
Si configuras una API key de OpenAI:
- ✅ Usa **Inteligencia Artificial real** (GPT-3.5-turbo)
- ✅ Entiende el contexto de la conversación
- ✅ Respuestas naturales y contextuales
- ✅ Conoce los pedidos y reportes del usuario
- ✅ Restricciones estrictas para mantener el chat enfocado en ProntoClick

### 2. **Modo Fallback (Sin OpenAI)**
Si NO configuras OpenAI o falla:
- ✅ Usa **respuestas predefinidas inteligentes**
- ✅ Detecta la intención del usuario (pedidos, reportes, cupones, etc.)
- ✅ Personaliza respuestas según el contexto del usuario
- ✅ Muestra información real de pedidos y reportes del usuario
- ✅ Funciona perfectamente sin necesidad de API externa

## 🔧 Arquitectura

```
Usuario → Frontend (ChatWidget)
    ↓
HTTP REST API o WebSocket
    ↓
Backend (NestJS)
    ↓
ChatService
    ├─→ Si hay OpenAI → Llama a API de OpenAI
    └─→ Si no hay OpenAI → Usa respuestas predefinidas
    ↓
Base de Datos (Prisma)
    └─→ Guarda todas las conversaciones
```

## 🎯 Características

### ✅ Lo que SÍ puede hacer:
- Explicar cómo hacer pedidos
- Consultar estado de pedidos del usuario
- Información sobre reportes
- Guías de uso de la aplicación
- Información sobre cupones y promociones
- Explicar ProntoPuntos
- Ayudar con problemas técnicos básicos

### ❌ Lo que NO puede hacer:
- Responder sobre temas fuera de ProntoClick
- Hacer pedidos por el usuario
- Modificar datos directamente
- Acceder a información de otros usuarios

## 🔐 Restricciones de Seguridad

El asistente tiene **reglas estrictas**:
- Solo responde sobre ProntoClick
- Si preguntas algo fuera del contexto, te redirige
- Mantiene privacidad del usuario
- No puede acceder a información sensible

## 💡 Ventajas del Sistema Híbrido

1. **Funciona siempre**: Incluso sin OpenAI, el chat funciona perfectamente
2. **Inteligente**: Detecta intenciones y personaliza respuestas
3. **Contextual**: Conoce los pedidos y reportes del usuario
4. **Escalable**: Puedes agregar OpenAI cuando quieras
5. **Económico**: No necesitas pagar por OpenAI si no quieres

## 🚀 Configuración

### Sin OpenAI (Actual - Funciona así)
No necesitas hacer nada, ya funciona con respuestas predefinidas.

### Con OpenAI (Opcional)
Agrega en `Backend/.env`:
```env
OPENAI_API_KEY=tu_api_key_aqui
```

## 📊 Flujo de una Conversación

1. Usuario abre el chat
2. Se crea una sesión en la base de datos
3. Usuario envía un mensaje
4. El sistema:
   - Detecta la intención
   - Obtiene contexto del usuario (pedidos, reportes)
   - Si hay OpenAI → Genera respuesta con IA
   - Si no hay OpenAI → Usa respuesta predefinida inteligente
5. Guarda la conversación en la base de datos
6. Muestra la respuesta al usuario

## 🎨 Interfaz

- **WebSocket**: Para mensajes en tiempo real (opcional)
- **HTTP REST**: Como respaldo, siempre funciona
- **Estado visual**: Muestra si está conectado o usando HTTP

---

**En resumen**: Es un chatbot inteligente que puede usar IA real (OpenAI) o respuestas predefinidas inteligentes, dependiendo de tu configuración. Funciona perfectamente en ambos modos.

