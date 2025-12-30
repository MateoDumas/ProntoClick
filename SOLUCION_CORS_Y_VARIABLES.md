# 🔧 Solución: Errores de CORS y Variables de Entorno

## ❌ Problemas Detectados

1. **Frontend intenta conectarse a `localhost:3001`** - La variable `NEXT_PUBLIC_API_URL` no está configurada en Vercel
2. **Error de CORS** - El backend tiene `FRONTEND_URL=http://localhost:3000` en lugar de la URL de Vercel

## ✅ Solución

### Paso 1: Configurar Variable en Vercel

1. Ve a Vercel → Tu proyecto `ProntoClick`
2. Settings → Environment Variables
3. Agrega o verifica:
   ```
   NEXT_PUBLIC_API_URL=https://prontoclick-backend.onrender.com
   ```
4. **IMPORTANTE:** Si ya existe, verifica que sea exactamente esa URL (sin espacios, sin barras al final)
5. Guarda los cambios
6. Vercel hará un nuevo deploy automáticamente

### Paso 2: Actualizar FRONTEND_URL en Render

1. Ve a Render → Tu servicio backend
2. Settings → Environment
3. Busca `FRONTEND_URL` y actualízala:
   ```
   FRONTEND_URL=https://pronto-click.vercel.app
   ```
4. **IMPORTANTE:** Sin espacios, sin barras al final
5. Guarda los cambios
6. Render redeployará automáticamente

---

## 📋 Verificación

### Después de Actualizar:

1. **Espera ~2-3 minutos** para que ambos servicios redeployen
2. **Limpia la caché del navegador** (Ctrl+Shift+R o Cmd+Shift+R)
3. **Abre:** https://pronto-click.vercel.app
4. **Abre la consola** (F12) y verifica:
   - Las requests deberían ir a: `https://prontoclick-backend.onrender.com`
   - No deberían aparecer errores de CORS

---

## 🔍 Si Sigue Fallando

### Verifica en Vercel:
- Settings → Environment Variables
- Debe aparecer: `NEXT_PUBLIC_API_URL` = `https://prontoclick-backend.onrender.com`
- Si no aparece, agrégalo y haz un nuevo deploy manual

### Verifica en Render:
- Settings → Environment
- Debe aparecer: `FRONTEND_URL` = `https://pronto-click.vercel.app`
- Si no aparece, agrégalo

---

**Actualiza ambas variables y espera a que redeployen** 🎯

