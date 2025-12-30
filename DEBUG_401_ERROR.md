# 🔍 Debug: Error 401 Unauthorized

## ✅ Tu Configuración se Ve Correcta

Veo que tienes:
- ✅ Headers configurados (Authorization y Content-Type)
- ✅ Body en JSON con la URL
- ✅ URL del endpoint correcta

## 🔍 Posibles Causas del 401

### 1. El Deploy en Render Aún No Terminó
El código nuevo se subió hace unos minutos. Render puede tardar 2-3 minutos en hacer deploy.

**Verificar:**
1. Ve a Render: https://dashboard.render.com
2. Selecciona tu servicio "prontoclick-backend"
3. Ve a "Events" → Verifica que el último deploy esté "Live" (verde)
4. Si está en progreso, espera a que termine

### 2. El Token Está Expirado
Los tokens JWT expiran en 15 minutos.

**Solución:**
1. Obtén un token nuevo (haz login de nuevo en tu app)
2. Actualiza el header Authorization en Postman

### 3. El Token No Se Está Enviando Correctamente
A veces Postman no envía el header correctamente.

**Solución:**
1. Ve a la pestaña "Authorization" (no "Headers")
2. Tipo: "Bearer Token"
3. Token: Pega solo el token (sin "Bearer")
4. Esto es más confiable que usar Headers manualmente

## 🧪 Probar el Endpoint de Status (Sin Autenticación)

Primero, verifica que el deploy se completó:

```
GET https://prontoclick-backend.onrender.com/upload/status
```

**No requiere autenticación.** Deberías ver:
```json
{
  "cloudinary": {
    "configured": true,
    "message": "Cloudinary está configurado correctamente"
  }
}
```

Si este endpoint funciona, el deploy está completo.

## 🔧 Solución Paso a Paso

### Paso 1: Verificar Deploy
1. Ve a Render → Events
2. Espera a que el último deploy esté "Live"

### Paso 2: Obtener Token Nuevo
1. Ve a tu app: https://pronto-click.vercel.app
2. Haz login de nuevo
3. Obtén un token nuevo

### Paso 3: Usar Pestaña Authorization (Recomendado)
1. En Postman, ve a la pestaña **"Authorization"**
2. Tipo: **"Bearer Token"**
3. Token: Pega tu token (sin "Bearer")
4. Esto configura automáticamente el header

### Paso 4: Probar de Nuevo
1. Verifica que la URL sea correcta
2. Verifica que el Body sea JSON con `{ "url": "..." }`
3. Click "Send"

## 📝 Checklist Final

- [ ] Deploy en Render completado (verificado en Events)
- [ ] Token nuevo obtenido (menos de 5 minutos)
- [ ] Usando pestaña "Authorization" (no "Headers")
- [ ] URL correcta: `/upload/restaurant/[ID]/image-url`
- [ ] Body: raw → JSON → `{ "url": "..." }`

## 🆘 Si Sigue Fallando

Comparte:
1. El estado del deploy en Render (¿está "Live"?)
2. La respuesta exacta del error
3. Si el endpoint `/upload/status` funciona

¡Esto me ayudará a identificar el problema exacto!

