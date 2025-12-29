# 🗄️ Guía de Migraciones de Base de Datos en Producción

Esta guía explica cómo manejar las migraciones de Prisma en un entorno de producción de forma segura.

---

## ⚠️ IMPORTANTE: Diferencias entre Desarrollo y Producción

### Desarrollo
```bash
npm run prisma:migrate
# o
npx prisma migrate dev
```
- Crea nuevas migraciones automáticamente
- Aplica migraciones inmediatamente
- Puede resetear la base de datos
- **NO USAR EN PRODUCCIÓN**

### Producción
```bash
npx prisma migrate deploy
```
- Solo aplica migraciones pendientes
- No crea nuevas migraciones
- No resetea la base de datos
- **SEGURO para producción**

---

## 📋 Proceso Recomendado

### 1. Desarrollo Local

```bash
# 1. Hacer cambios en Schema.prisma
# 2. Crear migración
npm run prisma:migrate
# Cuando pregunte el nombre: "add_new_feature"

# 3. Verificar que la migración funciona
npm run prisma:studio
# Probar la aplicación localmente
```

### 2. Revisar Migraciones

```bash
# Ver migraciones pendientes
npx prisma migrate status

# Ver contenido de una migración
cat Prisma/migrations/[nombre]/migration.sql
```

### 3. Backup de Producción (CRÍTICO)

**SIEMPRE hacer backup antes de migrar en producción:**

```bash
# Backup completo
pg_dump -U usuario -d prontoclick_prod > backup_$(date +%Y%m%d_%H%M%S).sql

# O usando Prisma
npx prisma db pull --schema=./Prisma/Schema.prisma > backup_schema.prisma
```

### 4. Aplicar Migraciones en Producción

```bash
# Opción A: Directo (si tienes acceso SSH)
cd Backend
npm install  # Asegurar dependencias actualizadas
npm run prisma:generate
npx prisma migrate deploy

# Opción B: Con script de deployment
npm run deploy  # Si tienes un script configurado
```

### 5. Verificar Migración

```bash
# Verificar estado
npx prisma migrate status

# Debería mostrar: "Database schema is up to date!"
```

---

## 🔄 Estrategias de Migración

### Migración Simple (Sin Downtime)

Para cambios que no afectan datos existentes:

```sql
-- Ejemplo: Agregar columna nullable
ALTER TABLE "User" ADD COLUMN "newField" TEXT;
```

**Proceso:**
1. ✅ Backup
2. ✅ Aplicar migración
3. ✅ Verificar aplicación funciona
4. ✅ Si hay errores, restaurar backup

### Migración Compleja (Con Downtime)

Para cambios que requieren transformación de datos:

**Ejemplo:** Cambiar tipo de columna

```sql
-- Paso 1: Agregar nueva columna
ALTER TABLE "User" ADD COLUMN "email_new" TEXT;

-- Paso 2: Migrar datos
UPDATE "User" SET "email_new" = "email";

-- Paso 3: Eliminar columna vieja
ALTER TABLE "User" DROP COLUMN "email";

-- Paso 4: Renombrar nueva columna
ALTER TABLE "User" RENAME COLUMN "email_new" TO "email";
```

**Proceso:**
1. ✅ Backup completo
2. ⚠️ **MODO MANTENIMIENTO** (desactivar aplicación)
3. ✅ Aplicar migración
4. ✅ Verificar datos
5. ✅ Reactivar aplicación
6. ✅ Monitorear errores

---

## 🛡️ Rollback (Revertir Migración)

### Si algo sale mal:

```bash
# 1. Detener aplicación
pm2 stop prontoclick-backend

# 2. Restaurar backup
psql -U usuario -d prontoclick_prod < backup_20241229_120000.sql

# 3. Verificar restauración
npx prisma db pull
npx prisma migrate status

# 4. Reiniciar aplicación
pm2 start prontoclick-backend
```

---

## 📝 Checklist Pre-Migración

- [ ] Migración probada en desarrollo
- [ ] Backup de producción creado
- [ ] Migración revisada (verificar SQL generado)
- [ ] Plan de rollback preparado
- [ ] Ventana de mantenimiento programada (si es necesario)
- [ ] Equipo notificado
- [ ] Monitoreo activo

---

## 🚨 Errores Comunes y Soluciones

### Error: "Migration X is in a failed state"

```bash
# Marcar migración como aplicada (si ya se aplicó manualmente)
npx prisma migrate resolve --applied "nombre_migracion"

# O marcar como revertida
npx prisma migrate resolve --rolled-back "nombre_migracion"
```

### Error: "Database schema is not in sync"

```bash
# Sincronizar schema con base de datos
npx prisma db pull
npx prisma migrate dev --create-only
# Revisar migración generada
npx prisma migrate deploy
```

### Error: "Foreign key constraint violation"

- Verificar que no hay datos huérfanos
- Aplicar migración en orden correcto
- Considerar migración en múltiples pasos

---

## 🔐 Mejores Prácticas

1. **Siempre hacer backup antes de migrar**
2. **Probar migraciones en staging primero**
3. **Revisar SQL generado antes de aplicar**
4. **Usar transacciones cuando sea posible**
5. **Migraciones pequeñas y frecuentes > migraciones grandes**
6. **Documentar cambios importantes**
7. **Tener plan de rollback siempre**

---

## 📚 Comandos Útiles

```bash
# Ver estado de migraciones
npx prisma migrate status

# Ver historial de migraciones
ls Prisma/migrations/

# Crear migración sin aplicarla
npx prisma migrate dev --create-only

# Aplicar migraciones pendientes (producción)
npx prisma migrate deploy

# Resetear base de datos (SOLO DESARROLLO)
npx prisma migrate reset

# Ver diferencias entre schema y BD
npx prisma db pull
```

---

## 🆘 Soporte

Si encuentras problemas:
1. Revisa los logs: `pm2 logs prontoclick-backend`
2. Verifica estado de migraciones: `npx prisma migrate status`
3. Consulta documentación: https://www.prisma.io/docs/guides/migrate

---

**Recuerda:** En producción, siempre usa `prisma migrate deploy`, nunca `prisma migrate dev`.

