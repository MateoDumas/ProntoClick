# 🔧 Solución: Error "Cannot find module dist/main.js" en Render

## ❌ El Problema

El build fue exitoso, pero el Start Command no encuentra `dist/main.js` porque el `cd Backend` no persiste en el Start Command.

Error:
```
Error: Cannot find module '/opt/render/project/src/Backend/dist/main.js'
```

## ✅ Solución: Usar ruta absoluta o verificar estructura

### Opción 1: Usar ruta absoluta (Recomendado)

**Start Command:**
```bash
node /opt/render/project/src/Backend/dist/main.js
```

---

### Opción 2: Verificar estructura y usar cd con sh -c

**Start Command:**
```bash
sh -c "cd /opt/render/project/src/Backend && node dist/main.js"
```

---

### Opción 3: Usar npm run start:prod (si funciona)

**Start Command:**
```bash
cd /opt/render/project/src/Backend && npm run start:prod
```

---

## 📋 Configuración Recomendada en Render

### Settings → Build & Deploy

- **Root Directory:** (vacío)
- **Build Command:** 
  ```
  cd Backend && npm install --legacy-peer-deps --include=dev && npx prisma@5.22.0 generate --schema=Prisma/Schema.prisma && npm run build
  ```
- **Start Command:** 
  ```
  node /opt/render/project/src/Backend/dist/main.js
  ```

---

## 🔍 ¿Por qué funciona?

- La ruta absoluta `/opt/render/project/src/Backend/dist/main.js` apunta directamente al archivo compilado
- No depende de `cd` que puede no persistir
- Es la forma más confiable en Render

---

**Prueba primero la Opción 1 con la ruta absoluta** 🎯

