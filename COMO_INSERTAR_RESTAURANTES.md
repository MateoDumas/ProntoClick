# 🍕 Cómo Insertar Múltiples Restaurantes

## 📋 Paso 1: Insertar Restaurantes en Supabase

### Opción A: Usando SQL (Recomendado - Más Rápido)

1. Ve a Supabase: https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Ve a **"SQL Editor"** (en el menú lateral)
4. Haz clic en **"New query"**
5. Copia y pega el contenido del archivo `INSERTAR_RESTAURANTES.sql`
6. Haz clic en **"Run"** (o presiona `Ctrl + Enter`)

**Nota:** Todos los restaurantes usarán la misma imagen por ahora (la que subiste). Después puedes actualizar las imágenes individualmente.

---

### Opción B: Insertar Manualmente (Uno por Uno)

1. Ve a Supabase → **"Table Editor"** → **"Restaurant"**
2. Haz clic en **"Insert"**
3. Completa los campos:
   - **name:** Nombre del restaurante
   - **description:** Descripción
   - **image:** URL de Cloudinary (puedes usar la misma por ahora)
   - **rating:** 4.5 (opcional)
4. Haz clic en **"Save"**
5. Repite para cada restaurante

---

## 📋 Paso 2: Actualizar Imágenes Individuales (Opcional)

Una vez que tengas varios restaurantes, puedes actualizar las imágenes de cada uno:

### Método 1: Usando el Nuevo Endpoint Automático

1. Obtén el ID del restaurante (en Supabase → Table Editor)
2. En Postman:
   - Method: `POST`
   - URL: `https://prontoclick-backend.onrender.com/upload/restaurant/[ID]/image`
   - Headers: `Authorization: Bearer TU_JWT_TOKEN`
   - Body: `form-data` → `file` → Selecciona imagen
   - Click "Send"

### Método 2: Manualmente en Supabase

1. Sube la imagen en Postman usando `/upload/restaurant-image`
2. Copia la URL de la respuesta
3. Ve a Supabase → Table Editor → Restaurant
4. Edita el restaurante
5. Pega la URL en el campo `image`
6. Guarda

---

## 📋 Paso 3: Verificar en tu App

1. Ve a tu app: https://pronto-click.vercel.app
2. Ve a la sección de restaurantes
3. Deberías ver todos los restaurantes que insertaste

---

## 🎯 Restaurantes de Ejemplo Incluidos

El script SQL incluye:
- Pizza Express
- Sushi Master
- Burger House
- Taco Loco
- Pasta Italiana
- Wok Express
- BBQ Grill
- Café Delicioso

**Total: 8 restaurantes**

---

## 💡 Tip

Si quieres usar imágenes diferentes para cada restaurante:
1. Sube una imagen en Postman
2. Usa el endpoint automático: `POST /upload/restaurant/:id/image`
3. Se actualizará automáticamente

---

## ✅ Checklist

- [ ] Inserté los restaurantes usando SQL
- [ ] Verifiqué que aparecen en Supabase
- [ ] Verifiqué que aparecen en mi app
- [ ] (Opcional) Actualicé las imágenes de cada restaurante

---

¡Listo! Ahora deberías ver más restaurantes en tu app. 🚀

