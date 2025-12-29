# 🚀 Opciones de Deployment para ProntoClick

Esta guía compara las mejores plataformas para desplegar ProntoClick según tus necesidades.

---

## ⚠️ Por qué NO GitHub Pages

GitHub Pages **solo sirve sitios estáticos** (HTML/CSS/JS estático). ProntoClick necesita:
- ✅ Backend Node.js (NestJS)
- ✅ Base de datos PostgreSQL
- ✅ WebSockets (chat en tiempo real)
- ✅ Variables de entorno

**GitHub Pages NO puede ejecutar Node.js ni bases de datos.**

---

## 🏆 Mejores Opciones (Ranking)

### 1. 🥇 **Railway** (RECOMENDADO - Más Fácil)

**Ideal para:** Principiantes, desarrollo rápido, MVP

**Ventajas:**
- ✅ Deploy automático desde GitHub
- ✅ Base de datos PostgreSQL incluida
- ✅ Variables de entorno fáciles de configurar
- ✅ SSL automático
- ✅ Plan gratuito generoso ($5 crédito/mes)
- ✅ Logs integrados
- ✅ Muy fácil de usar

**Desventajas:**
- ⚠️ Puede ser más caro a escala
- ⚠️ Menos control sobre infraestructura

**Precio:**
- Gratis: $5 crédito/mes (suficiente para MVP)
- Pago: $0.000463/GB RAM-hora + $0.000231/GB almacenamiento

**Cómo deployar:**
```bash
# 1. Conectar repositorio en Railway
# 2. Railway detecta automáticamente NestJS
# 3. Agregar servicio PostgreSQL
# 4. Configurar variables de entorno
# 5. ¡Listo!
```

**Link:** https://railway.app

---

### 2. 🥈 **Vercel (Frontend) + Railway/Render (Backend)**

**Ideal para:** Máximo rendimiento, separación de concerns

**Ventajas:**
- ✅ Vercel es EXCELENTE para Next.js (optimizado)
- ✅ CDN global para frontend
- ✅ Deploy automático
- ✅ SSL automático
- ✅ Plan gratuito generoso

**Desventajas:**
- ⚠️ Necesitas dos servicios (más complejo)
- ⚠️ Configurar CORS entre servicios

**Precio:**
- Vercel: Gratis (hasta 100GB bandwidth/mes)
- Railway/Render: Ver precios arriba

**Cómo deployar:**
```bash
# Frontend (Vercel)
cd Frontend
vercel --prod

# Backend (Railway o Render)
# Conectar repositorio y configurar
```

**Links:**
- Vercel: https://vercel.com
- Railway: https://railway.app
- Render: https://render.com

---

### 3. 🥉 **Render** (Buena Alternativa)

**Ideal para:** Equilibrio entre facilidad y control

**Ventajas:**
- ✅ Deploy automático desde GitHub
- ✅ PostgreSQL gestionado incluido
- ✅ SSL automático
- ✅ Plan gratuito disponible
- ✅ Fácil de usar

**Desventajas:**
- ⚠️ Plan gratuito puede "dormir" después de inactividad
- ⚠️ Menos flexible que opciones self-hosted

**Precio:**
- Gratis: Servicios "sleep" después de 15 min inactividad
- Pago: $7/mes por servicio (no duerme)

**Link:** https://render.com

---

### 4. **DigitalOcean App Platform**

**Ideal para:** Aplicaciones profesionales, más control

**Ventajas:**
- ✅ Muy confiable y estable
- ✅ Escalable
- ✅ PostgreSQL gestionado disponible
- ✅ Buen soporte

**Desventajas:**
- ⚠️ Más caro ($5-12/mes mínimo)
- ⚠️ Configuración más compleja

**Precio:**
- $5/mes (Basic) + $15/mes (PostgreSQL)

**Link:** https://www.digitalocean.com/products/app-platform

---

### 5. **Heroku**

**Ideal para:** Si ya tienes experiencia con Heroku

**Ventajas:**
- ✅ Muy establecido y confiable
- ✅ Add-ons disponibles
- ✅ Buena documentación

**Desventajas:**
- ❌ Ya no tiene plan gratuito (eliminado en 2022)
- ⚠️ Más caro que alternativas ($7/mes mínimo)

**Precio:**
- $7/mes (Eco Dyno) + $5/mes (PostgreSQL Mini)

**Link:** https://www.heroku.com

---

### 6. **Self-Hosted (VPS)**

**Ideal para:** Máximo control, bajo costo a largo plazo

**Opciones:**
- DigitalOcean Droplet ($6/mes)
- Linode ($5/mes)
- Vultr ($6/mes)
- AWS EC2 (pay-as-you-go)

**Ventajas:**
- ✅ Control total
- ✅ Más barato a largo plazo
- ✅ Puedes instalar lo que quieras

**Desventajas:**
- ❌ Necesitas configurar todo manualmente
- ❌ Mantenimiento requerido
- ❌ SSL manual (Let's Encrypt)
- ❌ Backups manuales

**Recomendado si:** Tienes experiencia con servidores Linux

---

## 📊 Comparación Rápida

| Plataforma | Facilidad | Precio | PostgreSQL | SSL | Mejor Para |
|------------|-----------|--------|------------|-----|------------|
| **Railway** | ⭐⭐⭐⭐⭐ | $5/mes | ✅ Incluido | ✅ Auto | MVP, Principiantes |
| **Vercel + Railway** | ⭐⭐⭐⭐ | Gratis-$5 | ✅ Incluido | ✅ Auto | Producción |
| **Render** | ⭐⭐⭐⭐ | Gratis-$7 | ✅ Incluido | ✅ Auto | MVP |
| **DigitalOcean** | ⭐⭐⭐ | $20/mes | ✅ Add-on | ✅ Auto | Producción |
| **Heroku** | ⭐⭐⭐⭐ | $12/mes | ✅ Add-on | ✅ Auto | Si ya lo usas |
| **VPS** | ⭐⭐ | $6/mes | Manual | Manual | Máximo control |

---

## 🎯 Recomendación Final

### Para MVP / Desarrollo:
**🥇 Railway** - La opción más fácil y rápida

### Para Producción:
**🥇 Vercel (Frontend) + Railway (Backend)** - Mejor rendimiento y escalabilidad

### Si tienes presupuesto limitado:
**🥇 Render (Plan Gratuito)** - Funciona bien, solo "duerme" después de inactividad

---

## 🚀 Guía Rápida: Deploy en Railway (Recomendado)

### Paso 1: Preparar Repositorio

```bash
# Asegúrate de que tu código esté en GitHub
git add .
git commit -m "Preparado para deployment"
git push origin main
```

### Paso 2: Crear Cuenta en Railway

1. Ve a https://railway.app
2. Inicia sesión con GitHub
3. Click en "New Project"
4. Selecciona "Deploy from GitHub repo"
5. Elige tu repositorio

### Paso 3: Configurar Backend

1. Railway detectará automáticamente que es NestJS
2. Agregar servicio PostgreSQL:
   - Click en "+ New"
   - Selecciona "Database" → "PostgreSQL"
3. Configurar variables de entorno:
   - Click en tu servicio backend
   - Ve a "Variables"
   - Agrega todas las variables de `Backend/.env`

**Variables críticas:**
```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=tu_secreto_generado
NODE_ENV=production
FRONTEND_URL=https://tu-frontend.vercel.app
PORT=3001
```

### Paso 4: Configurar Build

Railway detectará automáticamente, pero puedes verificar:
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm run start:prod`
- **Root Directory:** `Backend`

### Paso 5: Deploy Frontend en Vercel

```bash
cd Frontend
npm install -g vercel
vercel login
vercel --prod
```

Configurar variables:
- `NEXT_PUBLIC_API_URL=https://tu-backend.railway.app`

### Paso 6: Actualizar CORS

En Railway, actualiza `FRONTEND_URL` con la URL de Vercel.

---

## 🔧 Configuración Específica por Plataforma

### Railway

**Archivo `railway.json` (opcional):**
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run start:prod",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### Vercel

**Archivo `vercel.json` (en Frontend/):**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "env": {
    "NEXT_PUBLIC_API_URL": "https://tu-backend.railway.app"
  }
}
```

### Render

**Archivo `render.yaml` (en raíz):**
```yaml
services:
  - type: web
    name: prontoclick-backend
    env: node
    buildCommand: cd Backend && npm install && npm run build
    startCommand: cd Backend && npm run start:prod
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        fromDatabase:
          name: prontoclick-db
          property: connectionString

databases:
  - name: prontoclick-db
    plan: free
    databaseName: prontoclick
    user: prontoclick
```

---

## 💡 Tips Importantes

### 1. Variables de Entorno
- **NUNCA** subas `.env` al repositorio
- Usa las variables de entorno de la plataforma
- Railway/Render tienen interfaces para esto

### 2. Base de Datos
- Usa la base de datos gestionada de la plataforma
- NO uses SQLite en producción
- Configura backups automáticos

### 3. Migraciones
- Ejecuta migraciones en el build o como script separado
- Railway: Puedes ejecutar `prisma migrate deploy` en el build

### 4. Logs
- Todas las plataformas tienen logs integrados
- Monitorea errores regularmente

### 5. SSL/HTTPS
- Todas las plataformas modernas lo incluyen automáticamente
- No necesitas configurar nada

---

## 🆘 Solución de Problemas

### Error: "Cannot connect to database"
- Verifica que `DATABASE_URL` está configurada correctamente
- Verifica que la base de datos está corriendo
- Revisa logs de la plataforma

### Error: "Build failed"
- Verifica que todas las dependencias están en `package.json`
- Revisa logs de build para errores específicos
- Asegúrate de que `npm run build` funciona localmente

### Frontend no se conecta al Backend
- Verifica `NEXT_PUBLIC_API_URL` en Vercel
- Verifica `FRONTEND_URL` en Railway
- Revisa CORS en el backend

---

## 📚 Recursos

- [Railway Docs](https://docs.railway.app)
- [Vercel Docs](https://vercel.com/docs)
- [Render Docs](https://render.com/docs)
- [DigitalOcean App Platform](https://www.digitalocean.com/docs/app-platform)

---

**¿Necesitas ayuda con el deployment?** Revisa la guía específica de la plataforma que elijas.

