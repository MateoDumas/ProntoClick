# 🔧 Variables de Entorno para Render

## ✅ Variables OBLIGATORIAS (Agrega estas primero)

### 1. NODE_ENV
```
NODE_ENV=production
```

### 2. DATABASE_URL
```
DATABASE_URL=postgresql://postgres.qkjtnkmmxaeznpwtvppd:ProntoClick2024Secure@aws-1-us-east-2.pooler.supabase.com:5432/postgres?sslmode=require
```
**Nota:** Esta es tu URL de Supabase con Session Pooler

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

1. En la sección "Environment Variables"
2. Click en **"+ Add Environment Variable"**
3. Agrega cada variable:
   - **Name:** `NODE_ENV`
   - **Value:** `production`
4. Repite para cada variable
5. Click en **"Deploy Web Service"**

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

