# 🧪 Probar Conexión a Supabase - Guía de Diagnóstico

## ✅ Lo que ya hicimos

- ✅ Contraseña cambiada a: `ProntoClick2024Secure`
- ✅ `.env` actualizado con nueva contraseña
- ✅ SSL configurado (`sslmode=require`)
- ✅ Sin restricciones de red en Supabase

## ❌ Error Actual

```
Can't reach database server at `db.qkjtnkmmxaeznpwtvppd.supabase.co:5432`
```

## 🔍 Posibles Causas

### 1. Proyecto Pausado en Supabase

**Verificar:**
1. Ve a https://app.supabase.com
2. Selecciona tu proyecto
3. Verifica que el proyecto esté **activo** (no pausado)
4. Si está pausado, reactívalo

### 2. Firewall/Antivirus Bloqueando

**Probar:**
- Desactiva temporalmente el firewall de Windows
- O agrega una excepción para PostgreSQL (puerto 5432)

### 3. Necesita Connection Pooling

Supabase puede requerir usar connection pooling en lugar de conexión directa.

**Buscar URL de Pooling:**
1. Settings → Database
2. Busca "Connection string" o "Connection info"
3. O ve a Settings → API
4. Busca la sección de "Database URL" o "Connection Pooling"

### 4. Probar con pgAdmin o DBeaver

Para verificar si el problema es de Prisma o de la conexión en general:

1. Descarga pgAdmin: https://www.pgadmin.org/download/
2. Crea una nueva conexión con estos datos:
   - Host: `db.qkjtnkmmxaeznpwtvppd.supabase.co`
   - Port: `5432`
   - Database: `postgres`
   - Username: `postgres`
   - Password: `ProntoClick2024Secure`
   - SSL Mode: `Require`
3. Intenta conectar

**Resultados:**
- ✅ Si conecta en pgAdmin → El problema es con Prisma/Node.js
- ❌ Si no conecta → El problema es con Supabase/red

---

## 🔄 Soluciones Alternativas

### Opción A: Usar Connection Pooling (Recomendado)

Si encuentras la URL de pooling, úsala. El formato es:
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@[REGION].pooler.supabase.com:6543/postgres?sslmode=require
```

### Opción B: Probar Sin SSL Temporalmente

**Solo para diagnóstico**, prueba sin SSL:

```env
DATABASE_URL="postgresql://postgres:ProntoClick2024Secure@db.qkjtnkmmxaeznpwtvppd.supabase.co:5432/postgres?schema=public"
```

(Sin `&sslmode=require`)

Si funciona sin SSL, el problema es la configuración SSL.

### Opción C: Descargar Certificado SSL

1. En Supabase: Settings → Database → SSL Configuration
2. Click en "Download certificate"
3. Guarda como `Backend/supabase-ca.crt`
4. Actualiza `Schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  sslcert  = "./supabase-ca.crt"
}
```

---

## 📋 Checklist de Diagnóstico

- [ ] Proyecto de Supabase está activo (no pausado)
- [ ] Firewall no está bloqueando
- [ ] Probé con pgAdmin/DBeaver
- [ ] Busqué URL de Connection Pooling
- [ ] Probé sin SSL (temporalmente)
- [ ] Descargué certificado SSL

---

## 🆘 Si Nada Funciona

**Alternativa:** Usa una base de datos local de PostgreSQL para desarrollo y Supabase solo para producción.

O prueba con otra plataforma de base de datos gratuita:
- **Neon** (PostgreSQL serverless): https://neon.tech
- **Railway** (PostgreSQL incluido): https://railway.app

---

**¿Qué quieres probar primero?** Te recomiendo verificar que el proyecto esté activo en Supabase.

