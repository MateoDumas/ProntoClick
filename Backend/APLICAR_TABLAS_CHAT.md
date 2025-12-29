# 🔧 Aplicar Tablas de Chat a la Base de Datos

## Problema
El error 500 ocurre porque las tablas `ChatSession` y `ChatMessage` no existen en la base de datos, aunque están en el schema de Prisma.

## Solución Rápida

### Opción 1: Usar Prisma DB Push (Recomendado)

1. **Abre una terminal en la carpeta Backend**
2. **Ejecuta:**
```bash
npx prisma db push
```

Esto sincronizará el schema con la base de datos sin crear migraciones.

### Opción 2: Usar el Script TypeScript

1. **Abre una terminal en la carpeta Backend**
2. **Ejecuta:**
```bash
npx ts-node Prisma/add-chat-tables.ts
```

### Opción 3: Ejecutar SQL Manualmente

Si tienes acceso a tu base de datos PostgreSQL, puedes ejecutar el archivo:
`Backend/Prisma/add-chat-tables.sql`

## Verificación

Después de aplicar las tablas:

1. **Reinicia el servidor:**
```bash
npm run start:dev
```

2. **Prueba el chat** - El error 500 debería desaparecer

## Nota Importante

Si usas `prisma db push`, Prisma puede sugerirte hacer una migración formal después. Eso está bien, pero `db push` es más rápido para desarrollo.

