# 🔧 Solución: Error "Cannot find module dist/main" en Render

## ❌ El Problema

El comando busca `/opt/render/project/src/Backend/dist/main` (sin extensión), pero Node.js necesita la extensión `.js` explícita cuando se usa ruta absoluta.

Error:
```
Error: Cannot find module '/opt/render/project/src/Backend/dist/main'
```

## ✅ Solución: Agregar extensión .js explícitamente

### Start Command Actualizado:

```bash
node /opt/render/project/src/Backend/dist/main.js
```

O si el archivo se llama solo `main` (sin extensión), verifica primero la estructura.

---

## 📋 Configuración en Render

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

## 🔍 Alternativa: Verificar estructura del build

Si el error persiste, el archivo podría estar en otra ubicación. Agrega esto temporalmente al Build Command para ver la estructura:

```bash
cd Backend && npm install --legacy-peer-deps --include=dev && npx prisma@5.22.0 generate --schema=Prisma/Schema.prisma && npm run build && ls -la dist/ && pwd
```

Esto mostrará:
- Los archivos en `dist/`
- La ruta actual después del build

---

## ✅ Después de Cambiar

1. Guarda los cambios en Render
2. Render hará un nuevo deploy automáticamente
3. El servidor debería iniciar correctamente

---

**Asegúrate de usar `.js` en la ruta absoluta** 🎯

