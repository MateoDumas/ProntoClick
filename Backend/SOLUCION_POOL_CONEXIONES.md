# Solución: Error MaxClientsInSessionMode - Pool de Conexiones

## Problema

Error: `MaxClientsInSessionMode: max clients reached in Session mode max clients are limited to pool_size`

Este error ocurre cuando se agotan las conexiones disponibles en el pool de Supabase.

## Soluciones Implementadas

### 1. Optimización del PrismaService
- ✅ Agregado `OnModuleDestroy` para cerrar conexiones correctamente
- ✅ Agregado manejo de errores y logging
- ✅ Agregado método `healthCheck()` para verificar conexión
- ✅ Agregado método `executeTransaction()` con timeouts

### 2. Optimización de Consultas
- ✅ Reemplazado `groupBy` en `getSurveyStats` por consulta manual
- ✅ Agregado manejo de errores con valores por defecto

### 3. Configuración de DATABASE_URL

Para Supabase, agrega parámetros de conexión al `DATABASE_URL`:

#### Formato Recomendado:
```
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@[REGION].pooler.supabase.com:6543/postgres?sslmode=require&connection_limit=10&pool_timeout=20"
```

#### Parámetros Importantes:
- `connection_limit=10`: Limita el número máximo de conexiones (ajusta según tu plan de Supabase)
- `pool_timeout=20`: Tiempo máximo de espera para obtener una conexión (segundos)
- `sslmode=require`: Requerido para Supabase

#### Ejemplo Completo:
```env
DATABASE_URL="postgresql://postgres.qkjtnkmmxaeznpwtvppd:TU_PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&connection_limit=10&pool_timeout=20"
```

### 4. Límites de Supabase

**Plan Free:**
- Session Pooler: Máximo 15 conexiones simultáneas
- Direct Connection: Máximo 4 conexiones simultáneas

**Plan Pro:**
- Session Pooler: Máximo 60 conexiones simultáneas
- Direct Connection: Máximo 15 conexiones simultáneas

### 5. Mejores Prácticas

1. **Usa Connection Pooling (Session Mode)**
   - Puerto: `6543` (pooling) en lugar de `5432` (directo)
   - Host: `pooler.supabase.com` en lugar de `db.supabase.co`

2. **Configura `connection_limit`**
   - Plan Free: `connection_limit=10` (deja margen)
   - Plan Pro: `connection_limit=50` (deja margen)

3. **Cierra conexiones correctamente**
   - El `PrismaService` ahora implementa `OnModuleDestroy`
   - Las conexiones se cierran automáticamente al detener la app

4. **Evita consultas pesadas**
   - Reemplazamos `groupBy` por consultas más simples
   - Usa `select` para limitar campos retornados
   - Agrega índices en campos usados frecuentemente

5. **Manejo de errores**
   - Los servicios ahora retornan valores por defecto en caso de error
   - El dashboard no falla completamente si hay un error de conexión

## Verificación

1. Verifica tu `DATABASE_URL` en `.env`:
   ```bash
   # Debe incluir connection_limit y pool_timeout
   DATABASE_URL="...?sslmode=require&connection_limit=10&pool_timeout=20"
   ```

2. Reinicia el servidor después de cambiar `DATABASE_URL`

3. Monitorea los logs para ver si el error persiste

## Si el Error Persiste

1. **Reduce `connection_limit`**:
   ```env
   connection_limit=5
   ```

2. **Aumenta `pool_timeout`**:
   ```env
   pool_timeout=30
   ```

3. **Verifica tu plan de Supabase**:
   - Ve a Dashboard → Settings → Database
   - Revisa los límites de conexiones

4. **Considera actualizar el plan** si necesitas más conexiones

## Notas

- Los cambios en `PrismaService` mejoran el manejo de conexiones
- La optimización de `getSurveyStats` evita usar `groupBy` que puede causar problemas
- Siempre usa Connection Pooling en producción con Supabase
