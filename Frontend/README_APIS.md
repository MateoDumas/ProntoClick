# 🗺️ Configuración de Google Maps API

## Pasos Rápidos

1. **Obtén tu API Key:**
   - Ve a: https://console.cloud.google.com/
   - Crea un proyecto o selecciona uno existente
   - Habilita: Maps JavaScript API, Places API, Geocoding API
   - Crea una clave de API

2. **Configura en Frontend:**
   - Crea `Frontend/.env.local`:
   ```env
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=tu_api_key_aqui
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

3. **Reinicia el servidor:**
   ```bash
   npm run dev
   ```

## Funcionalidades Implementadas

✅ Autocompletado de direcciones  
✅ Mapa interactivo para seleccionar ubicación  
✅ Detección automática de ubicación  
✅ Cálculo de distancia y tiempo de entrega  
✅ Cálculo dinámico de costo de envío  

## 🔌 Socket.io

Socket.io ya está configurado. Solo asegúrate de que el backend esté corriendo.

**Funcionalidades:**
- ✅ Tracking de pedidos en tiempo real
- ✅ Actualizaciones automáticas de estado
- ✅ Notificaciones instantáneas

