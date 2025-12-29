# 🗺️ Cómo Obtener tu API Key de Google Maps

## 📋 Pasos Detallados

### 1. Crear una Cuenta en Google Cloud Platform

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Inicia sesión con tu cuenta de Google (o crea una si no tienes)
3. Acepta los términos y condiciones

### 2. Crear un Proyecto

1. En la parte superior, haz clic en el selector de proyectos (junto al logo de Google Cloud)
2. Haz clic en **"Nuevo Proyecto"** (New Project)
3. Ingresa un nombre para tu proyecto, por ejemplo: **"ProntoClick Maps"**
4. Haz clic en **"Crear"** (Create)
5. Espera unos segundos y selecciona el proyecto recién creado

### 3. Habilitar las APIs Necesarias

1. En el menú lateral izquierdo, ve a **"APIs y servicios"** → **"Biblioteca"** (APIs & Services → Library)
2. Busca y habilita las siguientes APIs (una por una):

   **a) Maps JavaScript API**
   - Busca: "Maps JavaScript API"
   - Haz clic en el resultado
   - Haz clic en **"Habilitar"** (Enable)

   **b) Places API**
   - Busca: "Places API"
   - Haz clic en el resultado
   - Haz clic en **"Habilitar"** (Enable)

   **c) Geocoding API**
   - Busca: "Geocoding API"
   - Haz clic en el resultado
   - Haz clic en **"Habilitar"** (Enable)

   **d) Directions API** (Opcional, para rutas)
   - Busca: "Directions API"
   - Haz clic en el resultado
   - Haz clic en **"Habilitar"** (Enable)

### 4. Crear la API Key

1. Ve a **"APIs y servicios"** → **"Credenciales"** (APIs & Services → Credentials)
2. Haz clic en **"+ Crear credenciales"** (+ Create Credentials)
3. Selecciona **"Clave de API"** (API Key)
4. Se creará automáticamente una clave
5. **¡IMPORTANTE!** Haz clic en **"Restringir clave"** (Restrict Key) para mayor seguridad

### 5. Configurar Restricciones (Recomendado)

1. En la sección **"Restricciones de aplicación"** (Application restrictions):
   - Selecciona **"Sitios web HTTP"** (HTTP referrers)
   - Agrega:
     - `http://localhost:3000/*` (para desarrollo)
     - `http://localhost:*/*` (para cualquier puerto local)
     - Tu dominio de producción cuando lo tengas (ej: `https://tudominio.com/*`)

2. En la sección **"Restricciones de API"** (API restrictions):
   - Selecciona **"Limitar clave"** (Restrict key)
   - Marca solo las APIs que habilitaste:
     - ✅ Maps JavaScript API
     - ✅ Places API
     - ✅ Geocoding API
     - ✅ Directions API (si la habilitaste)

3. Haz clic en **"Guardar"** (Save)

### 6. Copiar la API Key

1. En la página de credenciales, verás tu API Key
2. Haz clic en el ícono de copiar 📋 para copiar la clave
3. **Guárdala en un lugar seguro** (la necesitarás en el siguiente paso)

### 7. Configurar en ProntoClick

1. En la carpeta `Frontend`, crea un archivo llamado `.env.local` (si no existe)
2. Agrega la siguiente línea:
   ```env
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=tu_api_key_aqui
   ```
3. Reemplaza `tu_api_key_aqui` con la clave que copiaste
4. Guarda el archivo
5. **Reinicia el servidor de desarrollo** del frontend:
   ```bash
   cd Frontend
   npm run dev
   ```

## 💰 Costos y Límites Gratuitos

Google Maps ofrece un **crédito mensual gratuito de $200 USD**, que incluye:

- **28,000 cargas de mapas** (Maps JavaScript API)
- **40,000 solicitudes de Places** (Places API)
- **40,000 solicitudes de Geocoding** (Geocoding API)

Esto es **más que suficiente para desarrollo y pruebas**. Solo pagarás si excedes estos límites.

## ⚠️ Importante

1. **Nunca compartas tu API Key públicamente** (no la subas a GitHub)
2. **Asegúrate de tener restricciones configuradas** para evitar uso no autorizado
3. **El archivo `.env.local` está en `.gitignore`** por defecto, así que no se subirá a Git

## 🔍 Verificar que Funciona

1. Abre la aplicación en `http://localhost:3000`
2. Ve a la página de checkout o de direcciones
3. Deberías ver el mapa cargándose correctamente
4. El autocompletado de direcciones debería funcionar

## ❌ Si Tienes Problemas

### Error: "ApiProjectMapError"
- Verifica que todas las APIs estén habilitadas
- Asegúrate de que la API Key tenga las restricciones correctas
- Verifica que la API Key esté correctamente copiada en `.env.local`

### Error: "This API project is not authorized"
- Ve a la consola de Google Cloud
- Verifica que las APIs estén habilitadas
- Espera unos minutos después de habilitar las APIs

### El mapa no carga
- Verifica que `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` esté en `.env.local`
- Reinicia el servidor de desarrollo
- Revisa la consola del navegador para ver errores específicos

## 📚 Recursos Adicionales

- [Documentación de Google Maps](https://developers.google.com/maps/documentation)
- [Guía de Inicio Rápido](https://developers.google.com/maps/documentation/javascript/quickstart)
- [Precios de Google Maps](https://mapsplatform.google.com/pricing/)

---

**¿Necesitas ayuda?** Si tienes problemas, revisa la consola del navegador (F12) para ver errores específicos.

