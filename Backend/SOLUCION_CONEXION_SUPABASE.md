# 🔧 Solución: Conexión a Supabase con Prisma

## ⚠️ Problema Actual

```
Can't reach database server at `db.qkjtnkmmxaeznpwtvppd.supabase.co:5432`
```

## ✅ Solución: Usar Connection Pooling

Supabase recomienda usar **Connection Pooling** en lugar de conexión directa. Es más confiable y funciona mejor con Prisma.

### Paso 1: Obtener URL de Connection Pooling

1. Ve a Supabase Dashboard
2. Settings → Database
3. Busca la sección **"Connection Pooling"**
4. Selecciona **"Session mode"** (o "Transaction mode")
5. Copia la URL que aparece

La URL se ve así:
```
postgresql://postgres.qkjtnkmmxaeznpwtvppd:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

**Diferencias:**
- Host: `aws-0-us-east-1.pooler.supabase.com` (en lugar de `db.xxx.supabase.co`)
- Puerto: `6543` (en lugar de `5432`)
- Usuario: `postgres.qkjtnkmmxaeznpwtvppd` (incluye el project ref)

### Paso 2: Actualizar .env

Reemplaza tu `DATABASE_URL` en `Backend/.env` con la URL de pooling:

```env
DATABASE_URL="postgresql://postgres.qkjtnkmmxaeznpwtvppd:Clarita2020%C3%B1%21%5D%5D@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require"
```

**Nota:** 
- Reemplaza `aws-0-us-east-1` con tu región real de Supabase
- La contraseña sigue siendo la misma (codificada)

### Paso 3: Probar Conexión

```bash
cd Backend
npx prisma db pull --schema=Prisma/Schema.prisma
```

---

## 🔄 Alternativa: Si No Encuentras Connection Pooling

Si no encuentras la sección de Connection Pooling, puedes construir la URL manualmente:

### Formato de Connection Pooling:

```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?sslmode=require
```

**Para tu proyecto:**
- PROJECT-REF: `qkjtnkmmxaeznpwtvppd`
- REGION: Necesitas verificar en Supabase Dashboard → Settings → General → Region

**Ejemplo (si tu región es us-east-1):**
```env
DATABASE_URL="postgresql://postgres.qkjtnkmmxaeznpwtvppd:Clarita2020%C3%B1%21%5D%5D@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require"
```

---

## 🆘 Si Aún No Funciona

### Opción 1: Verificar Región

1. Ve a Supabase Dashboard
2. Settings → General
3. Busca "Region" o "Project Region"
4. Úsala en la URL de pooling

### Opción 2: Probar Sin SSL (Solo para Prueba)

**⚠️ NO recomendado para producción**, pero puedes probar temporalmente:

```env
DATABASE_URL="postgresql://postgres:Clarita2020%C3%B1%21%5D%5D@db.qkjtnkmmxaeznpwtvppd.supabase.co:5432/postgres?schema=public"
```

(Sin `&sslmode=require`)

### Opción 3: Usar pgAdmin o DBeaver

Prueba conectarte con un cliente gráfico para verificar que la conexión funciona:
- Si funciona en pgAdmin → El problema es con Prisma/SSL
- Si no funciona → El problema es con Supabase/red

---

## 📝 Notas

- Connection Pooling es más confiable que conexión directa
- El puerto 6543 es para pooling, 5432 es directo
- SSL siempre es requerido en Supabase

---

**¿Necesitas ayuda para encontrar la URL de pooling?** Dime qué ves en Settings → Database → Connection Pooling.

