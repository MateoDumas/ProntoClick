# 🚀 Cómo Iniciar el Backend

## ⚠️ Problema Actual

El frontend no puede conectarse porque el backend no está corriendo o falta configuración.

## 📋 Pasos para Iniciar el Backend

### 1. Verificar/Configurar DATABASE_URL

Abre el archivo `Backend/.env` y verifica que tenga:

```env
DATABASE_URL="postgresql://postgres:TU_CONTRASEÑA@localhost:5432/prontoclick?schema=public"
```

**⚠️ IMPORTANTE:** 
- Reemplaza `TU_CONTRASEÑA` con tu contraseña real de PostgreSQL
- Si tu usuario no es `postgres`, cámbialo también
- Si el puerto no es `5432`, ajústalo

### 2. Verificar que PostgreSQL esté corriendo

Asegúrate de que PostgreSQL esté activo:
- En Windows: Verifica en "Servicios" que PostgreSQL esté "En ejecución"
- En Mac/Linux: `sudo systemctl status postgresql`

### 3. Verificar que la base de datos existe

La base de datos `prontoclick` debe existir. Si no existe:
```sql
CREATE DATABASE prontoclick;
```

### 4. Iniciar el Backend

Abre una terminal en la carpeta `Backend/`:

```bash
cd Backend
npm run start:dev
```

Deberías ver:
```
🚀 Backend running on http://localhost:3001
```

### 5. Verificar en el Frontend

Una vez que el backend esté corriendo, recarga la página del frontend. Los errores de conexión deberían desaparecer.

---

## 🆘 Si hay Errores

### Error: "password authentication failed"
- Verifica la contraseña en `DATABASE_URL`
- Asegúrate de que el usuario `postgres` tenga esa contraseña

### Error: "database does not exist"
- Crea la base de datos: `CREATE DATABASE prontoclick;`

### Error: "relation does not exist"
- Ejecuta las migraciones: `npm run prisma:migrate`

### Error: "Cannot find module"
- Instala dependencias: `npm install`

---

## ✅ Estado Actual del .env

Tu archivo `.env` tiene:
- ✅ Stripe configurado
- ✅ Cloudinary configurado
- ✅ SendGrid configurado
- ⚠️ DATABASE_URL necesita tu contraseña real

---

**Después de configurar DATABASE_URL, reinicia el servidor backend.**

