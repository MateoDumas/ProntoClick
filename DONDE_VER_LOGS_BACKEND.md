# 📋 Dónde Ver los Logs del Backend

## 🔍 Ubicación de los Logs

Los logs del backend aparecen en la **terminal/consola donde ejecutaste `npm run start:dev`**.

### Pasos para Ver los Logs:

1. **Busca la terminal donde está corriendo el backend**
   - Debería ser una ventana de terminal/PowerShell
   - O una pestaña en tu terminal integrada del IDE

2. **Deberías ver algo como esto:**
   ```
   [Nest] INFO  [NestFactory] Starting Nest application...
   [Nest] INFO  [InstanceLoader] AppModule dependencies initialized
   [Nest] INFO  [RoutesResolver] OrdersController {/orders}:
   [Nest] INFO  [RoutesResolver] PushNotificationsController {/push-notifications}:
   ...
   🚀 Backend running on http://localhost:3001
   ```

3. **Cuando creas un pedido, deberías ver mensajes como:**
   ```
   📱 Enviando notificación de confirmación de pedido [ID] al usuario [USER_ID]
   Intentando enviar notificación a X dispositivo(s) del usuario [USER_ID]
   ```

## 🔎 Qué Buscar Específicamente

### Al Iniciar el Backend:

**✅ Si Firebase está configurado:**
```
[PushNotificationsService] Firebase Cloud Messaging configurado correctamente
```

**⚠️ Si Firebase NO está configurado:**
```
[PushNotificationsService] Firebase no está configurado. Las notificaciones push no se enviarán.
```

### Al Crear un Pedido:

**✅ Si todo funciona:**
```
[OrdersService] 📱 Enviando notificación de confirmación de pedido [ID] al usuario [USER_ID]
[PushNotificationsService] Intentando enviar notificación a X dispositivo(s) del usuario [USER_ID]
[PushNotificationsService] Enviando notificación a X token(s) válido(s) de FCM
[PushNotificationsService] ✅ Notificación enviada a X/X dispositivos del usuario [USER_ID]
[PushNotificationsService] ✅ Notificación de confirmación enviada para pedido [ID]
```

**⚠️ Si hay problemas:**
```
[PushNotificationsService] ⚠️ Usuario [USER_ID] no tiene tokens válidos de FCM registrados
[PushNotificationsService] ⚠️ Tokens encontrados: X, pero son tokens locales
```

O:

```
[PushNotificationsService] ⚠️ Firebase no configurado. Las notificaciones push no se pueden enviar
```

## 📸 Cómo Compartir los Logs

Si quieres que te ayude a diagnosticar:

1. **Crea un pedido** desde el frontend
2. **Copia los mensajes** que aparecen en la terminal del backend
3. **Pégalos aquí** y te ayudo a identificar el problema

## 💡 Tip

Si no encuentras la terminal del backend:
- Busca en las pestañas de tu terminal integrada
- O ejecuta `npm run start:dev` en una nueva terminal para ver los logs

