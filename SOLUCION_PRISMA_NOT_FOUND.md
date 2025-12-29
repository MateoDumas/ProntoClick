# 🔧 Solución: Error "prisma: not found" en Render

## ❌ El Problema

El comando `npm run prisma:generate` falla porque el script intenta ejecutar `prisma` directamente, pero no está en el PATH.

Error:
```
sh: 1: prisma: not found
> prisma generate
```

## ✅ Solución

Usa `npx prisma generate` directamente en el Build Command en lugar de `npm run prisma:generate`.

### Build Command Actualizado:

```bash
cd Backend && npm install --legacy-peer-deps && npx prisma generate && npm run build
```

---

## 📋 Configuración Completa en Render

### Settings → Build & Deploy

- **Root Directory:** (vacío)
- **Build Command:** 
  ```
  cd Backend && npm install --legacy-peer-deps && npx prisma generate && npm run build
  ```
- **Start Command:** 
  ```
  cd Backend && node dist/main.js
  ```

---

## 🔍 ¿Por qué funciona?

- `npx` busca el ejecutable `prisma` en `node_modules/.bin/`
- No requiere que `prisma` esté en el PATH del sistema
- Es la forma recomendada de ejecutar binarios de npm

---

## ✅ Después de Cambiar

1. Guarda los cambios en Render
2. Render hará un nuevo deploy automáticamente
3. El build debería completarse exitosamente

---

**Esta solución debería resolver el error de Prisma** 🎯

