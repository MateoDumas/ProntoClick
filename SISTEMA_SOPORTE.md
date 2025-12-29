# Sistema de Soporte Humano - ProntoClick

## 📋 Resumen

Sistema completo de soporte humano que permite a los administradores gestionar chats, reportes y pedidos con problemas desde un dashboard centralizado.

## 🚀 Configuración Inicial

### 1. Crear Usuario de Soporte

Ejecuta el siguiente comando en la carpeta `Backend`:

```bash
npm run create:support
```

O con variables de entorno personalizadas:

```bash
SUPPORT_EMAIL=soporte@prontoclick.com SUPPORT_PASSWORD=TuPassword123! npm run create:support
```

**Credenciales por defecto:**
- Email: `soporte@prontoclick.com`
- Password: `Soporte123!`
- Nombre: `Soporte ProntoClick`

⚠️ **IMPORTANTE:** Cambia la contraseña después del primer inicio de sesión.

### 2. Verificar que el Usuario se Creó Correctamente

El script mostrará un mensaje de confirmación con las credenciales. Si el usuario ya existe, te lo indicará.

## 🎯 Funcionalidades

### Para Usuarios

#### Crear Reportes desde "Mis Pedidos"

1. Ve a "Mis Pedidos" en tu perfil
2. Selecciona cualquier pedido
3. Haz clic en el botón "🐛 Reportar Problema"
4. Completa el formulario:
   - Tipo de reporte (Problema, Reembolso, Cancelación)
   - Razón del reporte (requerido)
   - Descripción adicional (opcional)
5. Envía el reporte

El reporte será visible en el dashboard de soporte para revisión.

#### Solicitar Soporte Humano desde el Chat

1. Abre el chat de soporte
2. Selecciona una categoría de problema
3. Si el asistente no puede resolver tu problema, aparecerá el botón "Conectar con soporte humano"
4. Haz clic en el botón
5. Un agente de soporte se conectará contigo

### Para Administradores de Soporte

#### Acceder al Dashboard

1. Inicia sesión con las credenciales de soporte
2. Ve a `/support/dashboard`
3. El sistema verificará automáticamente tu rol

#### Dashboard de Soporte

El dashboard muestra:

**Estadísticas:**
- Chats activos
- Chats que necesitan soporte
- Reportes pendientes
- Reportes en revisión
- Pedidos con reportes

**Pestañas:**

1. **Resumen:** Vista general de chats urgentes y reportes recientes
2. **Chats:** Lista de todos los chats activos que requieren atención
3. **Reportes:** Todos los reportes pendientes con detalles
4. **Pedidos:** Pedidos agrupados con sus reportes asociados

#### Gestionar Chats

- Ver historial completo de conversaciones
- Responder como soporte humano
- Identificar chats urgentes (marcados en rojo)

#### Gestionar Reportes

- Ver detalles de cada reporte
- Actualizar estado (pending → reviewed → resolved/rejected)
- Agregar notas internas
- Ver pedido asociado

#### Gestionar Pedidos con Reportes

- Ver todos los pedidos que tienen reportes
- Ver múltiples reportes por pedido
- Acceder a detalles del pedido y restaurante

## 🔐 Seguridad

- Todos los endpoints de soporte están protegidos con `SupportGuard`
- Solo usuarios con rol `support` o `admin` pueden acceder
- El frontend verifica el rol antes de mostrar el dashboard

## 📡 Endpoints del Backend

### Soporte (requieren autenticación y rol de soporte)

- `GET /support/dashboard/stats` - Estadísticas del dashboard
- `GET /support/chats/active` - Chats activos
- `GET /support/chats/:sessionId` - Historial de un chat
- `POST /support/chats/:sessionId/message` - Enviar mensaje como soporte
- `GET /support/reports/pending` - Reportes pendientes
- `GET /support/orders/with-reports` - Pedidos con reportes
- `PUT /support/reports/:reportId/status` - Actualizar estado de reporte

### Reportes (para usuarios)

- `GET /reports` - Obtener reportes del usuario
- `GET /reports/:id` - Obtener un reporte específico
- `POST /reports` - Crear un nuevo reporte

## 🎨 Componentes Frontend

### Nuevos Componentes

- `CreateReportModal` - Modal para crear reportes desde pedidos
- `SupportRoute` - Guard para proteger rutas de soporte
- `SupportDashboard` - Dashboard principal de soporte

### Páginas

- `/support/dashboard` - Dashboard de soporte (requiere rol de soporte)
- `/orders/[id]` - Ahora incluye botón para reportar problemas

## 🔄 Flujo de Trabajo

### Usuario Reporta un Problema

1. Usuario crea reporte desde "Mis Pedidos"
2. Reporte aparece en dashboard de soporte con estado "pending"
3. Soporte revisa el reporte
4. Soporte actualiza estado a "reviewed" o "resolved"
5. Usuario puede ver el estado actualizado en su perfil

### Usuario Solicita Soporte en Chat

1. Usuario abre chat y selecciona problema
2. Si el asistente no puede resolver, aparece botón de escalación
3. Chat aparece en dashboard como "necesita soporte"
4. Soporte se conecta y responde
5. Usuario recibe respuesta del soporte humano

## 📝 Notas Importantes

- Los reportes están vinculados a pedidos específicos
- Los chats se marcan como "necesitan soporte" automáticamente cuando:
  - El usuario solicita soporte humano
  - El sentimiento es "frustrated" o "urgent"
  - La urgencia es "high"
- El dashboard se actualiza automáticamente cada 30 segundos
- Los mensajes de soporte humano se marcan con `[Soporte Humano]` en el chat

## 🐛 Troubleshooting

### No puedo acceder al dashboard

- Verifica que tu usuario tenga rol `support` o `admin`
- Verifica que estés autenticado
- Revisa la consola del navegador para errores

### No aparecen chats en el dashboard

- Verifica que haya chats activos con `status: 'active'`
- Verifica que los chats tengan metadata indicando necesidad de soporte
- Revisa los logs del backend

### Los reportes no se crean

- Verifica que el pedido pertenezca al usuario
- Verifica que el pedido exista
- Revisa los logs del backend para errores

## 🚀 Próximas Mejoras

- [ ] Notificaciones en tiempo real para soporte
- [ ] Sistema de asignación de chats a agentes
- [ ] Historial completo de interacciones
- [ ] Métricas y analytics de soporte
- [ ] Integración con sistema de tickets
- [ ] Respuestas rápidas predefinidas

