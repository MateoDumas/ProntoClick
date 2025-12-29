# 🔧 Solución: Error "nest: not found" en Render

## ❌ El Problema

El comando `nest build` falla porque `@nestjs/cli` está en `devDependencies` y no se instala en producción por defecto.

Error:
```
sh: 1: nest: not found
> nest build
```

## ✅ Solución: Instalar devDependencies

Agrega `--include=dev` al comando `npm install` para instalar también las devDependencies.

### Build Command Actualizado:

```bash
cd Backend && npm install --legacy-peer-deps --include=dev && npx prisma@5.22.0 generate --schema=Prisma/Schema.prisma && npm run build
```

---

## 📋 Configuración Completa en Render

### Settings → Build & Deploy

- **Root Directory:** (vacío)
- **Build Command:** 
  ```
  cd Backend && npm install --legacy-peer-deps --include=dev && npx prisma@5.22.0 generate --schema=Prisma/Schema.prisma && npm run build
  ```
- **Start Command:** 
  ```
  cd Backend && node dist/main.js
  ```

---

## 🔍 ¿Por qué funciona?

- `--include=dev` instala también las `devDependencies`
- `@nestjs/cli` estará disponible para ejecutar `nest build`
- El build se completará exitosamente

---

## ✅ Después de Cambiar

1. Guarda los cambios en Render
2. Render hará un nuevo deploy automáticamente
3. El build debería completarse exitosamente

---

**Esta solución debería resolver el error de "nest: not found"** 🎯

