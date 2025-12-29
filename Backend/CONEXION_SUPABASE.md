# 🔗 Connection String para Supabase - ProntoClick

## ✅ Connection String Correcta

Para tu proyecto Supabase, usa esta connection string:

```env
DATABASE_URL="postgresql://postgres:Clarita2020%C3%B1%21%5D%5D@db.qkjtnkmmxaeznpwtvppd.supabase.co:5432/postgres?schema=public&sslmode=require"
```

## 🔑 Componentes de la URL

- **Usuario:** `postgres`
- **Contraseña:** `Clarita2020ñ!]]` (codificada: `Clarita2020%C3%B1%21%5D%5D`)
- **Host:** `db.qkjtnkmmxaeznpwtvppd.supabase.co`
- **Puerto:** `5432`
- **Base de datos:** `postgres`
- **Schema:** `public`
- **SSL:** `require` ⬅️ **IMPORTANTE para Supabase**

## 📝 Cómo Actualizar tu .env

1. Abre `Backend/.env`
2. Busca la línea `DATABASE_URL`
3. Reemplázala con la URL de arriba (completa)
4. Guarda el archivo

## 🧪 Probar la Conexión

```bash
cd Backend
npx prisma db pull --schema=Prisma/Schema.prisma
```

Si funciona, verás que se conecta correctamente a Supabase.

## ⚠️ Si Aún No Funciona

### Verificar Restricciones de Red en Supabase

1. Ve a Supabase Dashboard
2. Settings → Database → Network Restrictions
3. Si hay restricciones, agrega tu IP o desactívalas temporalmente

### Verificar que la Base de Datos Esté Activa

1. Ve a Supabase Dashboard
2. Verifica que el proyecto esté activo (no pausado)
3. Si está pausado, reactívalo

### Probar con Connection Pooling

Supabase ofrece connection pooling que puede ser más confiable:

1. Ve a Settings → Database
2. Busca "Connection Pooling"
3. Usa la URL de pooling en lugar de la directa

