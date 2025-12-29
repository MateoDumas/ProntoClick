# 💰 Deployment 100% GRATIS - ProntoClick

Esta guía te muestra cómo desplegar ProntoClick completamente gratis usando servicios con planes gratuitos generosos.

---

## 🎯 Estrategia Recomendada (Mejor Opción)

### Frontend: **Vercel** (Gratis)
### Backend: **Render** (Gratis)
### Base de Datos: **Supabase** (Gratis)

**¿Por qué esta combinación?**
- ✅ Vercel: Excelente para Next.js, nunca duerme, CDN global
- ✅ Render: Backend gratis, solo "duerme" después de 15 min inactividad
- ✅ Supabase: PostgreSQL gratis, 500MB, muy generoso

---

## 📋 Plan Gratuito - Límites

### Vercel (Frontend)
- ✅ **Gratis para siempre**
- ✅ 100GB bandwidth/mes
- ✅ Deploy ilimitado
- ✅ SSL automático
- ✅ CDN global
- ✅ **NUNCA duerme**

### Render (Backend)
- ✅ **Gratis para siempre**
- ✅ 750 horas/mes (suficiente para 24/7)
- ✅ 512MB RAM
- ✅ SSL automático
- ⚠️ **Duerme después de 15 min inactividad** (despierta en ~30 seg)

### Supabase (Base de Datos)
- ✅ **Gratis para siempre**
- ✅ 500MB base de datos
- ✅ 2GB bandwidth/mes
- ✅ 50,000 usuarios activos/mes
- ✅ API REST incluida
- ✅ **NUNCA duerme**

---

## 🚀 Guía Paso a Paso

### Paso 1: Crear Base de Datos en Supabase (GRATIS)

1. Ve a https://supabase.com
2. Click en "Start your project"
3. Inicia sesión con GitHub
4. Click en "New Project"
5. Completa:
   - **Name:** `prontoclick`
   - **Database Password:** (guarda esta contraseña)
   - **Region:** Elige la más cercana
   - **Pricing Plan:** Free
6. Espera ~2 minutos a que se cree

7. **Obtener Connection String:**
   - Ve a "Settings" → "Database"
   - Busca "Connection string" → "URI"
   - Copia la URL (se ve así: `postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres`)

---

### Paso 2: Deploy Backend en Render (GRATIS)

1. Ve a https://render.com
2. Inicia sesión con GitHub
3. Click en "New +" → "Web Service"
4. Conecta tu repositorio de GitHub
5. Configura:
   - **Name:** `prontoclick-backend`
   - **Region:** Elige la más cercana
   - **Branch:** `main`
   - **Root Directory:** `Backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install && npm run prisma:generate && npm run build`
   - **Start Command:** `npm run start:prod`
   - **Plan:** **Free**

6. **Variables de Entorno:**
   Click en "Environment" y agrega:
   ```env
   NODE_ENV=production
   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres
   JWT_SECRET=tu_secreto_generado_aqui
   JWT_EXPIRES_IN=15m
   PORT=3001
   FRONTEND_URL=https://tu-app.vercel.app
   OPENAI_API_KEY=sk-tu-clave (opcional)
   STRIPE_SECRET_KEY=sk_test_... (opcional)
   SENDGRID_API_KEY=SG... (opcional)
   CLOUDINARY_CLOUD_NAME=... (opcional)
   ```

   **⚠️ IMPORTANTE:** 
   - Genera `JWT_SECRET` seguro: https://generate-secret.vercel.app/32
   - Reemplaza `[PASSWORD]` con la contraseña de Supabase
   - `FRONTEND_URL` lo actualizarás después de deployar el frontend

7. Click en "Create Web Service"
8. Espera ~5 minutos al primer deploy

9. **Obtener URL del Backend:**
   - Una vez deployado, verás algo como: `https://prontoclick-backend.onrender.com`
   - Copia esta URL

---

### Paso 3: Ejecutar Migraciones en Supabase

**Opción A: Desde tu computadora (Recomendado)**

```bash
cd Backend
# Crear archivo .env temporal
echo "DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres" > .env.supabase
# Reemplaza [PASSWORD] y la URL completa

# Ejecutar migraciones
npx prisma migrate deploy --schema=./Prisma/Schema.prisma
```

**Opción B: Desde Render (Después del deploy)**

1. En Render, ve a tu servicio
2. Click en "Shell"
3. Ejecuta:
```bash
cd Backend
npx prisma migrate deploy
```

---

### Paso 4: Deploy Frontend en Vercel (GRATIS)

1. Ve a https://vercel.com
2. Inicia sesión con GitHub
3. Click en "Add New..." → "Project"
4. Importa tu repositorio
5. Configura:
   - **Framework Preset:** Next.js
   - **Root Directory:** `Frontend`
   - **Build Command:** `npm run build` (o déjalo vacío, Vercel lo detecta)
   - **Output Directory:** `.next` (o déjalo vacío)

6. **Variables de Entorno:**
   Click en "Environment Variables" y agrega:
   ```env
   NEXT_PUBLIC_API_URL=https://prontoclick-backend.onrender.com
   ```
   (Reemplaza con la URL real de tu backend en Render)

7. Click en "Deploy"
8. Espera ~2 minutos

9. **Obtener URL del Frontend:**
   - Verás algo como: `https://prontoclick.vercel.app`
   - Copia esta URL

---

### Paso 5: Actualizar CORS en Backend

1. Ve a Render → Tu servicio backend
2. Click en "Environment"
3. Actualiza `FRONTEND_URL` con la URL de Vercel:
   ```env
   FRONTEND_URL=https://prontoclick.vercel.app
   ```
4. Render redeployará automáticamente

---

### Paso 6: Verificar que Todo Funciona

1. **Health Check:**
   ```bash
   curl https://prontoclick-backend.onrender.com/health
   ```
   Debería retornar estado OK

2. **Frontend:**
   - Abre la URL de Vercel
   - Debería cargar correctamente
   - Prueba login/registro

3. **API Docs (Swagger):**
   - Ve a: `https://prontoclick-backend.onrender.com/api/docs`
   - Deberías ver la documentación de la API

---

## ⚠️ Limitaciones del Plan Gratuito

### Render (Backend)
- ⚠️ **Duerme después de 15 minutos de inactividad**
- ⚠️ Primera request después de dormir tarda ~30 segundos
- ⚠️ 750 horas/mes (suficiente para ~24/7 si no duerme)

**Solución:** 
- Si necesitas que no duerma, considera usar un "ping service" gratuito:
  - https://uptimerobot.com (gratis, 50 monitors)
  - Configura un ping cada 10 minutos a tu backend

### Supabase (Base de Datos)
- ⚠️ 500MB máximo
- ⚠️ 2GB bandwidth/mes
- ⚠️ 50,000 usuarios activos/mes

**Suficiente para:** MVP, proyectos pequeños, desarrollo

---

## 🔄 Alternativa: Todo en Render (Más Simple)

Si prefieres tener todo en un solo lugar:

### Frontend + Backend en Render

1. **Backend:** Sigue Paso 2
2. **Frontend:** 
   - En Render, "New +" → "Static Site"
   - Root Directory: `Frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `Frontend/.next`
   - Plan: **Free**

**Ventaja:** Todo en un lugar
**Desventaja:** Frontend también puede "dormir" (aunque menos probable)

---

## 🆓 Otras Opciones Gratuitas

### Fly.io (Alternativa a Render)
- ✅ 3 VMs gratis
- ✅ 3GB storage
- ✅ No duerme
- ⚠️ Más complejo de configurar

**Link:** https://fly.io

### Railway (Crédito Gratis)
- ✅ $5 crédito/mes gratis
- ⚠️ Se acaba rápido si usas mucho
- ⚠️ Necesitas tarjeta (no cobra si no excedes)

**Link:** https://railway.app

---

## 💡 Tips para Mantenerlo Gratis

### 1. Optimizar Base de Datos
- Limpia datos antiguos regularmente
- Usa índices para queries eficientes
- Monitorea uso en Supabase dashboard

### 2. Optimizar Backend
- Usa caching cuando sea posible
- Optimiza queries de base de datos
- Monitorea logs en Render

### 3. Mantener Backend Despierto (Opcional)
- Usa UptimeRobot (gratis) para ping cada 10 min
- O crea un cron job que haga request a `/health`

### 4. Monitoreo Gratuito
- **Logs:** Render y Vercel tienen logs integrados
- **Uptime:** UptimeRobot (gratis)
- **Errors:** Considera Sentry (plan gratuito)

---

## 🐛 Solución de Problemas

### Backend "duerme" y tarda en responder
- **Solución:** Configura UptimeRobot para ping cada 10 minutos
- O acepta que la primera request después de inactividad tarda ~30 seg

### Error: "Database connection failed"
- Verifica `DATABASE_URL` en Render
- Verifica que Supabase está activo
- Revisa logs en Render

### Frontend no se conecta al Backend
- Verifica `NEXT_PUBLIC_API_URL` en Vercel
- Verifica `FRONTEND_URL` en Render
- Revisa CORS en logs del backend

### Migraciones no se ejecutan
- Ejecuta manualmente desde tu computadora (Paso 3)
- O usa el Shell de Render

---

## 📊 Resumen de URLs

Después del deployment tendrás:

- **Frontend:** `https://tu-app.vercel.app`
- **Backend:** `https://tu-backend.onrender.com`
- **API Docs:** `https://tu-backend.onrender.com/api/docs`
- **Health Check:** `https://tu-backend.onrender.com/health`
- **Supabase Dashboard:** https://app.supabase.com

---

## ✅ Checklist Final

- [ ] Supabase creado y migraciones ejecutadas
- [ ] Backend deployado en Render
- [ ] Variables de entorno configuradas
- [ ] Frontend deployado en Vercel
- [ ] CORS actualizado
- [ ] Health check funcionando
- [ ] Frontend se conecta al backend
- [ ] Login/registro funcionando

---

## 🎉 ¡Listo!

Tu aplicación está desplegada **100% gratis**. 

**Costos totales: $0/mes**

Solo recuerda:
- El backend puede "dormir" después de inactividad (primera request tarda ~30 seg)
- Monitorea el uso de Supabase (500MB puede llenarse con muchos datos)

¿Necesitas ayuda con algún paso específico?

