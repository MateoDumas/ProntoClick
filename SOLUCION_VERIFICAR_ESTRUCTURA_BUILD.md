# 🔧 Solución: Verificar Estructura del Build en Render

## ❌ El Problema

El Start Command no encuentra el archivo, posiblemente porque:
1. El archivo está en otra ubicación
2. El build genera el archivo con otro nombre
3. La ruta absoluta no es correcta

## ✅ Solución: Verificar estructura primero

### Paso 1: Agregar comando de verificación al Build Command

Temporalmente, modifica el Build Command para ver la estructura:

```bash
cd Backend && npm install --legacy-peer-deps --include=dev && npx prisma@5.22.0 generate --schema=Prisma/Schema.prisma && npm run build && echo "=== ESTRUCTURA DIST ===" && ls -la dist/ && echo "=== RUTA ACTUAL ===" && pwd
```

Esto mostrará:
- Los archivos en `dist/`
- La ruta actual después del build

### Paso 2: Usar Start Command con cd persistente

Si el archivo está en `dist/main.js`, usa:

**Start Command:**
```bash
sh -c "cd /opt/render/project/src/Backend && node dist/main.js"
```

O si prefieres usar npm:

**Start Command:**
```bash
sh -c "cd /opt/render/project/src/Backend && npm run start:prod"
```

---

## 📋 Configuración Recomendada

### Settings → Build & Deploy

- **Root Directory:** (vacío)
- **Build Command:** 
  ```
  cd Backend && npm install --legacy-peer-deps --include=dev && npx prisma@5.22.0 generate --schema=Prisma/Schema.prisma && npm run build
  ```
- **Start Command:** 
  ```
  sh -c "cd /opt/render/project/src/Backend && node dist/main.js"
  ```

---

## 🔍 Alternativa: Usar Root Directory

Si nada funciona, prueba configurar Root Directory:

1. **Root Directory:** `Backend`
2. **Build Command:** 
  ```
  npm install --legacy-peer-deps --include=dev && npx prisma@5.22.0 generate --schema=Prisma/Schema.prisma && npm run build
  ```
3. **Start Command:** 
  ```
  node dist/main.js
  ```

---

**Prueba primero con `sh -c` y la ruta absoluta** 🎯

