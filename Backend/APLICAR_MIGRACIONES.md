# 🔧 Aplicar Migraciones - Instrucciones

## ⚠️ IMPORTANTE: Detén el backend primero

Antes de ejecutar las migraciones, **detén el servidor backend** (Ctrl+C en la terminal donde está corriendo).

## Pasos para aplicar migraciones:

### 1. Detener el Backend
Presiona `Ctrl+C` en la terminal donde está corriendo el backend.

### 2. Ejecutar Migraciones
```bash
cd Backend
npx ts-node Prisma/apply-migrations-v3.ts
```

Este script:
- ✅ Aplica todas las migraciones SQL necesarias
- ✅ Crea las tablas: `Referral`, `SavedList`
- ✅ Agrega campos: `referralCode`, `referredBy`, `referralsCount` a `User`
- ✅ Agrega campo `tipAmount` a `Order`
- ✅ Crea todos los índices y foreign keys
- ✅ Regenera Prisma Client automáticamente

### 3. Si el script falla al regenerar Prisma Client

Ejecuta manualmente:
```bash
cd Backend
npx prisma generate
```

### 4. Reiniciar el Backend
```bash
cd Backend
npm run start:dev
```

## ✅ Verificación

Después de aplicar las migraciones, el backend debería compilar sin errores. Los errores de TypeScript deberían desaparecer porque Prisma Client ahora incluye:
- `tipAmount` en `Order`
- `referralCode`, `referredBy`, `referralsCount` en `User`
- Modelo `Referral` completo
- Modelo `SavedList` completo

## 🐛 Si hay problemas

Si encuentras errores:
1. Verifica que el backend esté detenido
2. Verifica que PostgreSQL esté corriendo
3. Verifica que `DATABASE_URL` en `.env` sea correcta
4. Intenta ejecutar `npx prisma generate` manualmente

