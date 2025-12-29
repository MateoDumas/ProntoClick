# 🔧 Solución: Error "package.json not found" en Render

## ❌ El Problema

Render está buscando `package.json` en la raíz del proyecto, pero tu backend está en la carpeta `Backend/`.

Error:
```
npm error path /opt/render/project/src/package.json
npm error enoent Could not read package.json
```

## ✅ La Solución

### Paso 1: Configurar Root Directory en Render

1. Ve a tu servicio en Render
2. Click en **"Settings"** (Configuración)
3. Busca la sección **"Build & Deploy"**
4. En **"Root Directory"**, escribe:
   ```
   Backend
   ```
5. Guarda los cambios

### Paso 2: Verificar Build Command

Asegúrate de que el **Build Command** sea:
```bash
npm install && npm run prisma:generate && npm run build
```

### Paso 3: Verificar Start Command

Asegúrate de que el **Start Command** sea:
```bash
npm run start:prod
```

### Paso 4: Redeploy

1. Click en **"Manual Deploy"** → **"Deploy latest commit"**
2. O haz un nuevo commit y push (Render redeployará automáticamente)

---

## 📋 Configuración Completa para Render

### Settings → Build & Deploy

- **Root Directory:** `Backend`
- **Build Command:** `npm install && npm run prisma:generate && npm run build`
- **Start Command:** `npm run start:prod`

### Environment Variables

- `NODE_ENV=production`
- `DATABASE_URL=postgresql://postgres.qkjtnkmmxaeznpwtvppd:ProntoClick2024Secure@aws-1-us-east-2.pooler.supabase.com:5432/postgres?sslmode=require`
- `JWT_SECRET=tu-secreto-generado`
- `JWT_EXPIRES_IN=15m`
- `PORT=3001`
- `FRONTEND_URL=https://placeholder.vercel.app`

---

## ✅ Después de Configurar

Una vez que configures el **Root Directory** como `Backend`, Render:
1. Buscará `package.json` en `Backend/package.json` ✅
2. Ejecutará los comandos desde `Backend/` ✅
3. El build debería funcionar correctamente ✅

---

**¡Eso debería resolver el error!** 🎉

