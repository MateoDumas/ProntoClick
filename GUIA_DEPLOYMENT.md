# 🚀 Guía de Deployment - ProntoClick

Esta guía te llevará paso a paso para desplegar ProntoClick en producción.

---

## 📋 Tabla de Contenidos

1. [Requisitos Previos](#requisitos-previos)
2. [Preparación del Entorno](#preparación-del-entorno)
3. [Configuración de Base de Datos](#configuración-de-base-de-datos)
4. [Configuración del Backend](#configuración-del-backend)
5. [Configuración del Frontend](#configuración-del-frontend)
6. [Deployment](#deployment)
7. [Verificación Post-Deployment](#verificación-post-deployment)
8. [Mantenimiento](#mantenimiento)

---

## ✅ Requisitos Previos

### Servidor/Infraestructura

- **Servidor VPS/Cloud** (AWS, DigitalOcean, Heroku, Railway, etc.)
  - Mínimo: 2GB RAM, 1 CPU
  - Recomendado: 4GB RAM, 2 CPUs
- **Dominio** (opcional pero recomendado)
- **PostgreSQL** (puede ser local o servicio gestionado como AWS RDS, Supabase, etc.)

### Herramientas Necesarias

- Node.js 18+ instalado
- npm o yarn
- Git
- PostgreSQL client (psql o pgAdmin)

---

## 🔧 Preparación del Entorno

### 1. Clonar el Repositorio

```bash
git clone <tu-repositorio>
cd ProntoClick
```

### 2. Crear Usuario de Producción (si es necesario)

```bash
# En tu servidor
sudo adduser prontoclick
sudo usermod -aG sudo prontoclick
```

---

## 🗄️ Configuración de Base de Datos

### Opción A: PostgreSQL Local

```bash
# Instalar PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Crear base de datos
sudo -u postgres psql
CREATE DATABASE prontoclick_prod;
CREATE USER prontoclick_user WITH PASSWORD 'tu_contraseña_segura';
GRANT ALL PRIVILEGES ON DATABASE prontoclick_prod TO prontoclick_user;
\q
```

### Opción B: Servicio Gestionado (Recomendado)

- **Supabase**: https://supabase.com
- **AWS RDS**: https://aws.amazon.com/rds/
- **DigitalOcean Managed Databases**: https://www.digitalocean.com/products/managed-databases

Obtén la URL de conexión de tu proveedor.

### 3. Ejecutar Migraciones

```bash
cd Backend
npm install
npm run prisma:generate
npm run prisma:migrate deploy
```

**⚠️ IMPORTANTE**: En producción, usa `prisma migrate deploy` en lugar de `prisma migrate dev`.

---

## ⚙️ Configuración del Backend

### 1. Crear Archivo `.env` de Producción

```bash
cd Backend
cp env.example .env
nano .env  # o usa tu editor preferido
```

### 2. Configurar Variables de Entorno

```env
# ============================================
# ENTORNO
# ============================================
NODE_ENV=production

# ============================================
# BASE DE DATOS
# ============================================
DATABASE_URL="postgresql://usuario:contraseña@host:5432/prontoclick_prod?schema=public"

# ============================================
# AUTENTICACIÓN JWT
# ============================================
# ⚠️ GENERA UN SECRETO SEGURO:
# openssl rand -base64 32
JWT_SECRET="tu_secreto_super_seguro_de_al_menos_32_caracteres"
JWT_EXPIRES_IN="15m"

# ============================================
# SERVIDOR
# ============================================
PORT=3001
FRONTEND_URL="https://tu-dominio.com"

# ============================================
# OPENAI (Opcional)
# ============================================
OPENAI_API_KEY="sk-tu-clave-openai"

# ============================================
# STRIPE (Producción)
# ============================================
STRIPE_SECRET_KEY="sk_live_tu_clave_de_produccion"

# ============================================
# SENDGRID
# ============================================
SENDGRID_API_KEY="SG.tu_clave_sendgrid"
FROM_EMAIL="noreply@tu-dominio.com"

# ============================================
# CLOUDINARY
# ============================================
CLOUDINARY_CLOUD_NAME="tu_cloud_name"
CLOUDINARY_API_KEY="tu_api_key"
CLOUDINARY_API_SECRET="tu_api_secret"
```

### 3. Generar Cliente Prisma

```bash
npm run prisma:generate
```

### 4. Probar Build

```bash
npm run build
```

Si hay errores, corrígelos antes de continuar.

---

## 🎨 Configuración del Frontend

### 1. Crear Archivo `.env.local`

```bash
cd Frontend
nano .env.local
```

```env
NEXT_PUBLIC_API_URL=https://api.tu-dominio.com
# o si backend y frontend están en el mismo dominio:
# NEXT_PUBLIC_API_URL=https://tu-dominio.com/api
```

### 2. Probar Build

```bash
npm install
npm run build
```

---

## 🚀 Deployment

### Opción A: Deployment Manual con PM2 (Recomendado para VPS)

#### 1. Instalar PM2

```bash
npm install -g pm2
```

#### 2. Iniciar Backend

```bash
cd Backend
npm run build
pm2 start dist/main.js --name prontoclick-backend
pm2 save
pm2 startup  # Para iniciar automáticamente al reiniciar
```

#### 3. Iniciar Frontend

```bash
cd Frontend
npm run build
pm2 start npm --name prontoclick-frontend -- start
pm2 save
```

#### 4. Configurar Nginx (Reverse Proxy)

```bash
sudo apt install nginx
sudo nano /etc/nginx/sites-available/prontoclick
```

```nginx
# Backend API
server {
    listen 80;
    server_name api.tu-dominio.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Frontend
server {
    listen 80;
    server_name tu-dominio.com www.tu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/prontoclick /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 5. Configurar SSL con Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d tu-dominio.com -d www.tu-dominio.com -d api.tu-dominio.com
```

### Opción B: Deployment con Docker

#### 1. Crear docker-compose.yml

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: prontoclick_prod
      POSTGRES_USER: prontoclick_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build: ./Backend
    ports:
      - "3001:3001"
    environment:
      DATABASE_URL: postgresql://prontoclick_user:${DB_PASSWORD}@postgres:5432/prontoclick_prod
      JWT_SECRET: ${JWT_SECRET}
      NODE_ENV: production
      FRONTEND_URL: https://tu-dominio.com
    depends_on:
      - postgres

  frontend:
    build: ./Frontend
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: https://api.tu-dominio.com
    depends_on:
      - backend

volumes:
  postgres_data:
```

#### 2. Deploy

```bash
docker-compose up -d
```

### Opción C: Plataformas Cloud (Heroku, Railway, Vercel)

#### Heroku

```bash
# Backend
cd Backend
heroku create prontoclick-api
heroku addons:create heroku-postgresql:hobby-dev
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=$(openssl rand -base64 32)
git push heroku main

# Frontend (Vercel es mejor para Next.js)
cd Frontend
vercel --prod
```

---

## ✅ Verificación Post-Deployment

### 1. Health Check

```bash
curl https://api.tu-dominio.com/health
```

Debería retornar:
```json
{
  "status": "ok",
  "timestamp": "...",
  "checks": {
    "database": { "status": "healthy" },
    "memory": { "status": "healthy" }
  }
}
```

### 2. Verificar Frontend

- Abre `https://tu-dominio.com`
- Verifica que carga correctamente
- Prueba login/registro
- Verifica que las requests van al backend correcto

### 3. Verificar Logs

```bash
# PM2
pm2 logs prontoclick-backend
pm2 logs prontoclick-frontend

# Docker
docker-compose logs -f
```

### 4. Monitoreo

- Verifica que no hay errores en los logs
- Revisa el uso de memoria y CPU
- Verifica conexiones a la base de datos

---

## 🔄 Mantenimiento

### Actualizar Código

```bash
# 1. Pull cambios
git pull origin main

# 2. Backend
cd Backend
npm install
npm run prisma:generate
npm run prisma:migrate deploy
npm run build
pm2 restart prontoclick-backend

# 3. Frontend
cd Frontend
npm install
npm run build
pm2 restart prontoclick-frontend
```

### Backups de Base de Datos

```bash
# Backup manual
pg_dump -U prontoclick_user prontoclick_prod > backup_$(date +%Y%m%d).sql

# Restaurar
psql -U prontoclick_user prontoclick_prod < backup_20241229.sql
```

**Configurar backups automáticos:**

```bash
# Agregar a crontab
crontab -e

# Backup diario a las 2 AM
0 2 * * * pg_dump -U prontoclick_user prontoclick_prod > /backups/prontoclick_$(date +\%Y\%m\%d).sql
```

### Monitoreo de Logs

```bash
# Ver logs en tiempo real
pm2 logs

# Ver solo errores
pm2 logs --err

# Limpiar logs
pm2 flush
```

---

## 🐛 Solución de Problemas Comunes

### Error: "Cannot connect to database"

1. Verifica que PostgreSQL está corriendo: `sudo systemctl status postgresql`
2. Verifica la URL de conexión en `.env`
3. Verifica firewall: `sudo ufw allow 5432`

### Error: "Port already in use"

```bash
# Ver qué proceso usa el puerto
sudo lsof -i :3001
# Matar proceso
kill -9 <PID>
```

### Error: "JWT_SECRET no puede usar un valor por defecto"

Genera un secreto seguro:
```bash
openssl rand -base64 32
```

### Frontend no se conecta al Backend

1. Verifica `NEXT_PUBLIC_API_URL` en `.env.local`
2. Verifica CORS en backend (`FRONTEND_URL`)
3. Verifica que el backend está accesible públicamente

---

## 📊 Checklist Pre-Deployment

- [ ] Variables de entorno configuradas
- [ ] `JWT_SECRET` generado y seguro (no valor por defecto)
- [ ] Base de datos creada y migraciones ejecutadas
- [ ] Build del backend exitoso
- [ ] Build del frontend exitoso
- [ ] SSL/HTTPS configurado
- [ ] Health check funcionando
- [ ] Logs configurados y accesibles
- [ ] Backups de base de datos configurados
- [ ] Monitoreo básico configurado

---

## 🔐 Seguridad Post-Deployment

1. **Firewall**: Configurar UFW o similar
   ```bash
   sudo ufw allow 22    # SSH
   sudo ufw allow 80    # HTTP
   sudo ufw allow 443   # HTTPS
   sudo ufw enable
   ```

2. **Actualizaciones**: Mantener sistema actualizado
   ```bash
   sudo apt update && sudo apt upgrade
   ```

3. **Variables Sensibles**: Nunca subir `.env` al repositorio

4. **Rate Limiting**: Ya está configurado en el backend

---

## 📚 Recursos Adicionales

- [Documentación de NestJS](https://docs.nestjs.com)
- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Prisma](https://www.prisma.io/docs)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [Nginx Documentation](https://nginx.org/en/docs/)

---

**¿Necesitas ayuda?** Revisa los logs o consulta la documentación de las tecnologías utilizadas.

