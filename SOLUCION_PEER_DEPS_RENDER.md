# 🔧 Solución: Error de Peer Dependencies en Render

## ❌ El Problema

npm encuentra conflictos de peer dependencies entre `@nestjs/core` y `@nestjs/platform-express`.

Error:
```
npm error Fix the upstream dependency conflict, or retry
npm error this command with --force or --legacy-peer-deps
```

## ✅ Solución

Agrega `--legacy-peer-deps` al comando `npm install` en el Build Command.

### Build Command Actualizado:

```bash
cd Backend && npm install --legacy-peer-deps && npm run prisma:generate && npm run build
```

---

## 📋 Configuración Completa en Render

### Settings → Build & Deploy

- **Root Directory:** (vacío)
- **Build Command:** 
  ```
  cd Backend && npm install --legacy-peer-deps && npm run prisma:generate && npm run build
  ```
- **Start Command:** 
  ```
  cd Backend && node dist/main.js
  ```

---

## 🔍 ¿Qué hace `--legacy-peer-deps`?

- Ignora los conflictos de peer dependencies
- Usa el algoritmo de resolución de npm v6 (más permisivo)
- Permite que la instalación continúe aunque haya conflictos menores

---

## ✅ Después de Cambiar

1. Guarda los cambios en Render
2. Render hará un nuevo deploy automáticamente
3. El build debería completarse exitosamente

---

**Esta solución debería resolver el error de peer dependencies** 🎯

