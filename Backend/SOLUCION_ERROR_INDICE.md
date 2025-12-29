# 🔧 Solución Error: Índice Duplicado

## Problema
Al ejecutar `prisma db push` aparece el error:
```
ERROR: la relación «Favorite_userId_restaurantId_key» ya existe
```

Esto ocurre porque Prisma intenta crear todas las tablas/índices del schema, y hay un conflicto con una tabla existente.

## Solución: Crear Solo las Tablas de Chat

### Opción 1: Ejecutar SQL Directamente (Más Rápido)

1. **Conéctate a tu base de datos PostgreSQL** (puedes usar pgAdmin, DBeaver, o psql)

2. **Ejecuta el archivo SQL:**
   - Abre `Backend/Prisma/create-chat-tables-only.sql`
   - Copia y pega el contenido en tu cliente SQL
   - Ejecuta el script

### Opción 2: Usar psql desde la terminal

Si tienes `psql` instalado:

```bash
# Reemplaza con tus credenciales de PostgreSQL
psql -U tu_usuario -d tu_base_de_datos -f Backend/Prisma/create-chat-tables-only.sql
```

### Opción 3: Usar Prisma Studio

1. Abre Prisma Studio:
```bash
cd Backend
npm run prisma:studio
```

2. En otra terminal, ejecuta el script TypeScript:
```bash
cd Backend
npx ts-node Prisma/add-chat-tables.ts
```

## Verificación

Después de crear las tablas:

1. **Reinicia el servidor:**
```bash
cd Backend
npm run start:dev
```

2. **Prueba el chat** - El error 500 debería desaparecer

## Nota

El error del índice duplicado en `Favorite` no afecta las tablas de chat. Solo necesitamos crear las tablas de chat, que es lo que hace el script SQL.

