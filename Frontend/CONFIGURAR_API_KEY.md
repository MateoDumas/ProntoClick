# 🔑 Configuración Rápida de Google Maps API Key

## ⚡ Pasos Rápidos (5 minutos)

### 1. Crear archivo `.env.local`

En la carpeta `Frontend`, crea un archivo llamado `.env.local` (si no existe).

### 2. Agregar la API Key

Abre el archivo `.env.local` y agrega:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=tu_api_key_aqui
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 3. Obtener tu API Key de Google Maps

#### Opción A: Ya tienes una API Key
- Simplemente cópiala y pégala en el archivo `.env.local`

#### Opción B: Necesitas crear una nueva API Key

1. **Ve a Google Cloud Console:**
   - https://console.cloud.google.com/

2. **Crea o selecciona un proyecto**

3. **Habilita las APIs necesarias:**
   - Ve a "APIs y servicios" → "Biblioteca"
   - Busca y habilita:
     - ✅ **Maps JavaScript API**
     - ✅ **Places API**
     - ✅ **Geocoding API**

4. **Crea la API Key:**
   - Ve a "APIs y servicios" → "Credenciales"
   - Haz clic en "+ Crear credenciales" → "Clave de API"
   - Copia la clave generada

5. **Configura restricciones (Recomendado):**
   - Haz clic en "Restringir clave"
   - En "Restricciones de aplicación", agrega:
     - `http://localhost:3000/*`
     - `http://localhost:*/*`
   - En "Restricciones de API", selecciona solo las APIs que habilitaste

6. **Pega la API Key en `.env.local`**

### 4. Reiniciar el servidor

```bash
# Detén el servidor (Ctrl+C) y reinícialo:
cd Frontend
npm run dev
```

## ✅ Verificar que funciona

1. Abre la aplicación en `http://localhost:3000`
2. Ve a la página de Checkout
3. El error de Google Maps debería desaparecer
4. Deberías poder usar el autocompletado de direcciones

## 📚 Guía Completa

Para más detalles, consulta: `/OBTENER_GOOGLE_MAPS_API_KEY.md`

## 💰 Costos

- **$200 USD crédito gratis/mes** (suficiente para desarrollo)
- Luego: ~$7 por cada 1000 cargas de mapa
- **Places API**: $17 por cada 1000 solicitudes

## ⚠️ Importante

- **Nunca subas el archivo `.env.local` a GitHub** (ya está en `.gitignore`)
- **Configura restricciones** en Google Cloud Console para mayor seguridad
- El archivo `.env.local` solo se usa en desarrollo local
