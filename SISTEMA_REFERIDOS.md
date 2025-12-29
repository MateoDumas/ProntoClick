# 🎁 Sistema de Referidos - ProntoClick

## ✅ Implementación Completada

### Backend

1. **Modelo de Datos** (`Backend/Prisma/Schema.prisma`):
   - Agregados campos a `User`: `referralCode`, `referredBy`, `referralsCount`
   - Nueva tabla `Referral` para rastrear referidos

2. **Servicio** (`Backend/Src/referrals/referrals.service.ts`):
   - `generateReferralCode()`: Genera código único de 8 caracteres
   - `validateReferralCode()`: Valida códigos de referido
   - `processReferral()`: Procesa referido al registrarse
   - `completeReferral()`: Completa referido cuando el usuario hace su primer pedido
   - `getReferralStats()`: Obtiene estadísticas de referidos

3. **Controlador** (`Backend/Src/referrals/referrals.controller.ts`):
   - `GET /referrals/code` - Obtiene código de referido del usuario
   - `GET /referrals/stats` - Obtiene estadísticas de referidos
   - `POST /referrals/validate` - Valida un código de referido

4. **Integraciones**:
   - `AuthService`: Procesa código de referido al registrarse
   - `OrdersService`: Completa referido cuando se hace el primer pedido
   - `RewardsService`: Método `addPoints()` para otorgar puntos

### Frontend

1. **Servicio** (`Frontend/src/services/referral.service.ts`):
   - Métodos para obtener código, estadísticas y validar códigos

2. **Componente** (`Frontend/src/components/referrals/ReferralCard.tsx`):
   - Muestra código de referido
   - Botón para copiar código
   - Botón para compartir (Web Share API)
   - Diseño atractivo con gradiente

3. **Página de Registro** (`Frontend/src/pages/register.tsx`):
   - Detecta código de referido desde URL (`?ref=CODIGO`)
   - Muestra mensaje cuando hay código aplicado
   - Envía código al backend al registrarse

4. **Página de Recompensas** (`Frontend/src/pages/rewards.tsx`):
   - Integrado `ReferralCard` para mostrar código de referido

## 📋 Pasos para Activar

### 1. Ejecutar Migración SQL

Ejecuta el script SQL para agregar los campos necesarios:

```bash
cd Backend
# Opción 1: Ejecutar directamente con psql
psql -U tu_usuario -d tu_base_de_datos -f Prisma/add-referral-fields.sql

# Opción 2: Usar Prisma migrate (recomendado)
npx prisma migrate dev --name add_referral_system
```

### 2. Regenerar Prisma Client

```bash
cd Backend
npx prisma generate
```

### 3. Reiniciar el Backend

```bash
cd Backend
npm run start:dev
```

## 🎯 Cómo Funciona

1. **Usuario se registra con código de referido**:
   - URL: `/register?ref=ABC12345`
   - El código se detecta automáticamente
   - Se crea registro de referido con estado "pending"

2. **Usuario referido hace su primer pedido**:
   - Sistema detecta que es el primer pedido
   - Completa el referido automáticamente
   - Otorga puntos:
     - **Referidor**: 100 puntos
     - **Referido**: 50 puntos

3. **Usuario puede ver su código**:
   - En la página `/rewards`
   - Puede copiar o compartir su código
   - Ve estadísticas de referidos

## 📊 Recompensas

- **Referidor**: 100 ProntoPuntos cuando su referido hace el primer pedido
- **Referido**: 50 ProntoPuntos de bienvenida al hacer su primer pedido

## 🔗 Compartir Código

Los usuarios pueden compartir su código de referido de dos formas:
1. **Copiar código**: Copia el código al portapapeles
2. **Compartir**: Usa Web Share API (si está disponible) o copia enlace completo

El enlace generado es: `https://tu-dominio.com/register?ref=CODIGO`

## 📝 Notas

- Los códigos son únicos de 8 caracteres alfanuméricos
- No se permite auto-referirse
- Solo se puede ser referido una vez
- El referido se completa cuando el usuario hace su primer pedido (no solo al registrarse)

