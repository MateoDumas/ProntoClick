# 🔄 Actualizar DATABASE_URL en Render - Guía Rápida

## ⚡ Actualización Necesaria

Para solucionar el error `MaxClientsInSessionMode: max clients reached`, necesitas actualizar tu `DATABASE_URL` en Render con los nuevos parámetros de optimización.

## 📋 Pasos para Actualizar

### 1. Ve a Render Dashboard
1. Abre https://dashboard.render.com
2. Inicia sesión
3. Selecciona tu servicio **prontoclick-backend**

### 2. Edita la Variable DATABASE_URL
1. Ve a la pestaña **"Environment"** (en el menú lateral izquierdo)
2. Busca la variable `DATABASE_URL` en la lista
3. Haz clic en el **ícono de editar** (lápiz) junto a `DATABASE_URL`

### 3. Actualiza el Valor

**Valor ANTIGUO:**
```
postgresql://postgres.qkjtnkmmxaeznpwtvppd:ProntoClick2024Secure@aws-1-us-east-2.pooler.supabase.com:5432/postgres?sslmode=require
```

**Valor NUEVO (copia y pega esto):**
```
postgresql://postgres.qkjtnkmmxaeznpwtvppd:ProntoClick2024Secure@aws-1-us-east-2.pooler.supabase.com:6543/postgres?sslmode=require&connection_limit=10&pool_timeout=20&pgbouncer=true
```

### 4. Guarda los Cambios
1. Haz clic en **"Save Changes"**
2. Render hará un **redeploy automático** (esto tomará ~3-5 minutos)
3. Espera a que el deploy termine

## ✅ Cambios Realizados

1. **Puerto cambiado:** `5432` → `6543` (Session Pooler)
2. **Parámetros agregados:**
   - `connection_limit=10`: Limita conexiones simultáneas
   - `pool_timeout=20`: Tiempo máximo de espera para obtener conexión
   - `pgbouncer=true`: **CRÍTICO** - Deshabilita prepared statements para evitar errores

## 🔍 Verificación

Después del redeploy, verifica en los logs que:
- ✅ No aparezcan errores de "MaxClientsInSessionMode"
- ✅ El servidor inicia correctamente
- ✅ Las consultas a la base de datos funcionan

## 📝 Notas

- **Plan Free de Supabase:** Máximo 15 conexiones en Session Pooler
- **Plan Pro de Supabase:** Máximo 60 conexiones en Session Pooler
- Si el error persiste, reduce `connection_limit` a `5` o `8`

## 🆘 Si Necesitas Ayuda

Si tienes problemas:
1. Verifica que el puerto sea `6543` (no `5432`)
2. Verifica que los parámetros estén correctamente escritos
3. Revisa los logs de Render para ver si hay otros errores
