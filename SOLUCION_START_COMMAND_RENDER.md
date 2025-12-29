# 🔧 Solución: Start Command Falla en Render

## ❌ El Problema

- ✅ **Build Command funciona:** `cd Backend && npm install && npm run prisma:generate && npm run build`
- ❌ **Start Command falla:** `cd Backend && npm run start:prod` no encuentra `package.json`

El problema es que `cd Backend` no persiste en el Start Command de Render.

## ✅ Soluciones

### Opción 1: Usar `sh -c` (Recomendado)

**Start Command:**
```bash
sh -c "cd Backend && npm run start:prod"
```

Esto fuerza a ejecutar el comando en un shell que mantiene el cambio de directorio.

---

### Opción 2: Usar `npm --prefix`

**Start Command:**
```bash
npm --prefix Backend run start:prod
```

Esto ejecuta npm desde el directorio Backend sin necesidad de `cd`.

---

### Opción 3: Usar ruta absoluta con `node`

**Start Command:**
```bash
cd Backend && node dist/main.js
```

O si el archivo está en otra ubicación:
```bash
cd Backend && node dist/src/main.js
```

---

### Opción 4: Crear script wrapper (Más robusto)

1. Crea un archivo `start.sh` en la raíz del proyecto:
```bash
#!/bin/bash
cd Backend
npm run start:prod
```

2. **Start Command:**
```bash
chmod +x start.sh && ./start.sh
```

---

## 🎯 Solución Recomendada (Prueba en este orden)

### 1. Primero prueba Opción 1:
```
sh -c "cd Backend && npm run start:prod"
```

### 2. Si no funciona, prueba Opción 2:
```
npm --prefix Backend run start:prod
```

### 3. Si tampoco funciona, verifica la ruta del archivo compilado:
```
cd Backend && ls -la dist/
```

Y usa Opción 3 con la ruta correcta.

---

## 📋 Configuración Final Recomendada

```
Root Directory: (vacío)
Build Command: cd Backend && npm install && npm run prisma:generate && npm run build
Start Command: sh -c "cd Backend && npm run start:prod"
```

---

**Prueba primero la Opción 1 con `sh -c`** 🎯

