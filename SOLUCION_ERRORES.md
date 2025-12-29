# 🔧 Solución de Errores

## 1. ❌ Error de Google Maps: BillingNotEnabledMapError

### Problema
```
Google Maps JavaScript API error: BillingNotEnabledMapError
```

### Solución

Este error indica que la facturación no está habilitada en tu cuenta de Google Cloud.

**Pasos para solucionarlo:**

1. **Ve a Google Cloud Console:**
   - Link: https://console.cloud.google.com/billing

2. **Habilita la facturación:**
   - Google Maps API requiere facturación habilitada (aunque tengas crédito gratuito)
   - No te cobrarán si no excedes el límite gratuito ($200/mes)

3. **Verifica que las APIs estén habilitadas:**
   - Maps JavaScript API
   - Places API
   - Geocoding API

**Nota:** En desarrollo, puedes usar el modo de prueba, pero para producción necesitas facturación habilitada.

---

## 2. ❌ Estado del pedido no cambia de "En camino" a "Entregado"

### Problema
El estado del pedido se queda en "En camino" y nunca cambia a "Entregado".

### Solución Aplicada

**Problema identificado:**
- El scheduler no incluía `'on_the_way'` en la lista de estados a procesar
- El tiempo se calculaba desde la creación del pedido, no desde el último cambio de estado

**Correcciones realizadas:**
1. ✅ Agregado `'on_the_way'` a la lista de estados a procesar
2. ✅ Cambiado el cálculo de tiempo para usar `updatedAt` en lugar de `createdAt`
3. ✅ Ajustados los tiempos de transición para ser más realistas

**Tiempos de desarrollo (para pruebas rápidas):**
- `pending` → `confirmed`: 10 segundos
- `confirmed` → `preparing`: 15 segundos desde confirmado
- `preparing` → `ready`: 20 segundos desde preparación
- `ready` → `on_the_way`: 15 segundos desde listo
- `on_the_way` → `delivered`: **20 segundos desde en camino** ⬅️ Esto es lo que faltaba

**Tiempos de producción:**
- `pending` → `confirmed`: 1 minuto
- `confirmed` → `preparing`: 2 minutos desde confirmado
- `preparing` → `ready`: 5 minutos desde preparación
- `ready` → `on_the_way`: 2 minutos desde listo
- `on_the_way` → `delivered`: **10 minutos desde en camino**

---

## ✅ Verificación

Después de reiniciar el backend:

1. **Crea un nuevo pedido**
2. **Espera a que llegue a "En camino"**
3. **Después de 20 segundos (en desarrollo) debería cambiar a "Entregado"**

---

## 🔄 Reiniciar el Backend

Para aplicar los cambios:

```bash
cd Backend
npm run start:dev
```

---

## 📝 Notas

- El scheduler revisa cada 5 segundos en desarrollo
- Los tiempos son acumulativos desde el último cambio de estado
- El WebSocket emite actualizaciones en tiempo real cuando cambia el estado

