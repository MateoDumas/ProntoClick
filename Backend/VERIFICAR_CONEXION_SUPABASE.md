# 🔍 Verificar Conexión a Supabase

## ⚠️ Error Actual

```
Can't reach database server at `db.qkjtnkmmxaeznpwtvppd.supabase.co:5432`
```

## 🔧 Soluciones

### 1. Verificar que el .env tenga SSL

Tu `DATABASE_URL` en `Backend/.env` debe ser:

```env
DATABASE_URL="postgresql://postgres:Clarita2020%C3%B1%21%5D%5D@db.qkjtnkmmxaeznpwtvppd.supabase.co:5432/postgres?schema=public&sslmode=require"
```

**Importante:** Debe tener `&sslmode=require` al final.

### 2. Verificar Restricciones de Red en Supabase

1. Ve a https://app.supabase.com
2. Selecciona tu proyecto
3. Settings → Database → **Network Restrictions**
4. Si dice "Your database can be accessed by all IP addresses" → ✅ Está bien
5. Si hay restricciones → Agrega tu IP o desactívalas temporalmente

### 3. Verificar que el Proyecto Esté Activo

1. En Supabase Dashboard
2. Verifica que el proyecto no esté pausado
3. Si está pausado, reactívalo

### 4. Probar con Connection Pooling (Alternativa)

Supabase ofrece connection pooling que puede ser más confiable:

1. Ve a Settings → Database
2. Busca "Connection Pooling" → "Session mode"
3. Usa esa URL en lugar de la directa

La URL de pooling se ve así:
```
postgresql://postgres.qkjtnkmmxaeznpwtvppd:Clarita2020%C3%B1%21%5D%5D@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require
```

Nota: El puerto es `6543` (pooling) en lugar de `5432` (directo).

### 5. Verificar Firewall/Antivirus

- Algunos firewalls bloquean conexiones PostgreSQL
- Prueba desactivar temporalmente el firewall
- O agrega una excepción para PostgreSQL

---

## 🧪 Probar Conexión Manual

Puedes probar la conexión directamente con `psql`:

```bash
# Instalar psql (si no lo tienes)
# Windows: Viene con PostgreSQL o puedes usar pgAdmin

# Probar conexión
psql "postgresql://postgres:Clarita2020%C3%B1%21%5D%5D@db.qkjtnkmmxaeznpwtvppd.supabase.co:5432/postgres?sslmode=require"
```

---

## ✅ Checklist

- [ ] `.env` tiene `DATABASE_URL` con `&sslmode=require`
- [ ] No hay restricciones de red en Supabase (o tu IP está permitida)
- [ ] El proyecto de Supabase está activo
- [ ] Firewall no está bloqueando la conexión
- [ ] La contraseña está correctamente codificada en URL

---

**Si nada funciona:** Prueba usar Connection Pooling de Supabase en lugar de la conexión directa.

