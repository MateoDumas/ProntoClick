# 🔐 Configurar Supabase - ProntoClick

## ⚠️ IMPORTANTE: Seguridad

**NUNCA compartas contraseñas en:**
- ❌ Chats públicos
- ❌ Repositorios de GitHub
- ❌ Documentos compartidos
- ❌ Mensajes de texto

**Si ya compartiste tu contraseña:**
1. Ve a Supabase Dashboard
2. Settings → Database → Reset Database Password
3. Genera una nueva contraseña segura

---

## 📋 Paso a Paso: Obtener Connection String

### 1. Ve a tu Proyecto en Supabase

1. Abre https://app.supabase.com
2. Selecciona tu proyecto `prontoclick`

### 2. Obtener Connection String

1. Ve a **Settings** (⚙️) en el menú lateral
2. Click en **Database**
3. Busca la sección **"Connection string"**
4. Selecciona la pestaña **"URI"**
5. Verás algo como:

```
postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```

### 3. Reemplazar la Contraseña

Reemplaza `[YOUR-PASSWORD]` con tu contraseña real:
- Tu contraseña: `Clarita2020ñ!]]`

**⚠️ IMPORTANTE:** Si tu contraseña tiene caracteres especiales, necesitas codificarla en URL:
- `ñ` → `%C3%B1`
- `!` → `%21`
- `]` → `%5D`

**Contraseña codificada:** `Clarita2020%C3%B1%21%5D%5D`

### 4. URL Final

Tu `DATABASE_URL` debería verse así (con SSL requerido):

```env
DATABASE_URL="postgresql://postgres:Clarita2020%C3%B1%21%5D%5D@db.xxxxx.supabase.co:5432/postgres?schema=public&sslmode=require"
```

**⚠️ IMPORTANTE:** Supabase requiere SSL, por eso agregamos `&sslmode=require` al final.

---

## 🔧 Configurar en tu Proyecto

### Opción A: Archivo .env Local (Desarrollo)

1. Ve a `Backend/`
2. Crea o edita `.env`:

```env
NODE_ENV=development
DATABASE_URL="postgresql://postgres:Clarita2020%C3%B1%21%5D%5D@db.xxxxx.supabase.co:5432/postgres?schema=public"
JWT_SECRET="tu-secreto-jwt-aqui"
JWT_EXPIRES_IN="15m"
PORT=3001
FRONTEND_URL="http://localhost:3000"
```

**⚠️ IMPORTANTE:** 
- El archivo `.env` está en `.gitignore` (no se sube a GitHub)
- NUNCA subas el archivo `.env` al repositorio

### Opción B: Render (Producción)

1. Ve a tu servicio en Render
2. Click en **Environment**
3. Agrega la variable:

```
DATABASE_URL = postgresql://postgres:Clarita2020%C3%B1%21%5D%5D@db.xxxxx.supabase.co:5432/postgres?schema=public
```

---

## 🧪 Probar la Conexión

### Desde tu Computadora

```bash
cd Backend

# Generar Prisma Client
npm run prisma:generate

# Probar conexión
npx prisma db pull

# Si funciona, verás el schema de tu base de datos
```

### Ejecutar Migraciones

```bash
cd Backend

# Aplicar migraciones
npx prisma migrate deploy

# O si es la primera vez
npx prisma migrate dev --name init
```

---

## 🔒 Mejores Prácticas de Seguridad

### 1. Cambiar Contraseña (Recomendado)

Si compartiste tu contraseña, cámbiala:

1. Supabase Dashboard → Settings → Database
2. Click en **"Reset Database Password"**
3. Genera una contraseña segura
4. Guarda la nueva contraseña en un gestor de contraseñas (1Password, LastPass, etc.)

### 2. Usar Connection Pooling (Opcional)

Supabase ofrece connection pooling. En Settings → Database, busca:
- **Connection Pooling** → **Session mode**
- Usa esa URL en lugar de la directa (mejor para producción)

### 3. Restringir Acceso

En Supabase Dashboard:
- Settings → Database → Network Restrictions
- Agrega las IPs que pueden conectarse (opcional, para más seguridad)

---

## 🐛 Solución de Problemas

### Error: "password authentication failed"

- Verifica que la contraseña esté correcta
- Verifica que los caracteres especiales estén codificados en URL
- Prueba cambiar la contraseña en Supabase

### Error: "connection timeout"

- Verifica que la base de datos esté activa en Supabase
- Verifica tu conexión a internet
- Verifica que no haya restricciones de red

### Error: "database does not exist"

- Verifica que el nombre de la base de datos sea `postgres` (default de Supabase)
- O usa el nombre correcto si creaste una diferente

---

## 📝 Notas Importantes

1. **Contraseña con caracteres especiales:** Siempre codifícala en URL
2. **Connection String:** Úsala solo en variables de entorno, nunca en código
3. **Backup:** Supabase hace backups automáticos, pero puedes exportar manualmente
4. **Límites del plan gratis:** 500MB, suficiente para MVP

---

## ✅ Checklist

- [ ] Obtuve la Connection String de Supabase
- [ ] Codifiqué la contraseña en URL (si tiene caracteres especiales)
- [ ] Configuré `DATABASE_URL` en `.env` (desarrollo)
- [ ] Configuré `DATABASE_URL` en Render (producción)
- [ ] Probé la conexión con `npx prisma db pull`
- [ ] Ejecuté migraciones con `npx prisma migrate deploy`
- [ ] Cambié la contraseña si la compartí públicamente

---

**¿Necesitas ayuda?** Revisa los logs de Prisma o los logs de Render para ver errores específicos.

