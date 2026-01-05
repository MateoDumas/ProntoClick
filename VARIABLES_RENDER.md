# 🔧 Variables de Entorno para Render

## ✅ Variables OBLIGATORIAS (Agrega estas primero)

### 1. NODE_ENV
```
NODE_ENV=production
```

### 2. DATABASE_URL
```
DATABASE_URL=postgresql://postgres.qkjtnkmmxaeznpwtvppd:ProntoClick2024Secure@aws-1-us-east-2.pooler.supabase.com:6543/postgres?sslmode=require&connection_limit=10&pool_timeout=20
```
**Nota:** 
- Usa el puerto **6543** (Session Pooler) en lugar de 5432 (Direct Connection)
- Los parámetros `connection_limit=10` y `pool_timeout=20` optimizan el pool de conexiones
- Esto previene el error "MaxClientsInSessionMode: max clients reached"

### 3. JWT_SECRET
```
JWT_SECRET=tu-secreto-super-seguro-de-al-menos-32-caracteres-aqui
```
**Genera uno seguro aquí:** https://generate-secret.vercel.app/32

### 4. JWT_EXPIRES_IN
```
JWT_EXPIRES_IN=15m
```

### 5. PORT
```
PORT=3001
```

### 6. FRONTEND_URL
```
FRONTEND_URL=https://tu-app.vercel.app
```
**Nota:** Por ahora pon cualquier URL, la actualizarás después de deployar el frontend en Vercel

---

## 🔹 Variables OPCIONALES (Agrega si las tienes)

### 7. OPENAI_API_KEY (Para el chatbot inteligente)
```
OPENAI_API_KEY=sk-tu-clave-openai-aqui
```

### 8. STRIPE_SECRET_KEY (Para pagos)
```
STRIPE_SECRET_KEY=sk_test_tu_clave_stripe
```

### 9. CLOUDINARY (Para imágenes)
```
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

### 10. SENDGRID (Para emails)
```
SENDGRID_API_KEY=SG.tu_clave_sendgrid
FROM_EMAIL=noreply@prontoclick.com
```

### 11. GOOGLE_MAPS_API_KEY (Para mapas)
```
GOOGLE_MAPS_API_KEY=tu_clave_google_maps
```

---

## 📝 Cómo Agregar en Render

⚠️ **IMPORTANTE:** El archivo `.env` NO se sube a GitHub. Debes configurar las variables **directamente en Render**.

### Pasos:

1. Ve a tu servicio en Render Dashboard
2. Click en **"Environment"** (en el menú lateral)
3. Click en **"+ Add Environment Variable"**
4. Agrega cada variable:
   - **Key:** `NODE_ENV`
   - **Value:** `production`
5. Click en **"Save Changes"**
6. Repite para cada variable
7. Render hará un **redeploy automático** después de guardar

### Verificación:

- Todas las variables deben aparecer en la lista
- Render redeployará automáticamente después de guardar
- Espera ~3-5 minutos para que el redeploy complete

📖 **Guía detallada:** Ver `/CONFIGURAR_VARIABLES_PRODUCCION.md`

---

## ⚠️ IMPORTANTE

- **NUNCA** pongas espacios alrededor del `=`
- **NUNCA** uses comillas en el valor (a menos que el valor mismo las necesite)
- **SÍ** usa comillas si el valor tiene espacios o caracteres especiales
- Guarda tus secretos en un lugar seguro

---

## ✅ Orden Recomendado de Agregar

1. Primero agrega las 6 variables obligatorias
2. Deploy el servicio
3. Verifica que funciona
4. Luego agrega las opcionales según necesites

