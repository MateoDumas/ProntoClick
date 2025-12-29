# ✅ Configurar Stripe en .env

## 🔑 Tu Secret Key de Stripe

```
sk_test_TU_SECRET_KEY_AQUI
```

**⚠️ IMPORTANTE:** Reemplaza `TU_SECRET_KEY_AQUI` con tu clave real de Stripe.

## 📝 Pasos para Configurar

### 1. Abre el archivo `Backend/.env`

Si no existe, créalo en la carpeta `Backend/`.

### 2. Agrega esta línea al final del archivo:

```env
# Stripe (Pagos)
STRIPE_SECRET_KEY=sk_test_TU_SECRET_KEY_AQUI
```

### 3. Guarda el archivo

### 4. Reinicia el servidor backend

```bash
cd Backend
npm run start:dev
```

## ✅ Verificar que Funciona

Cuando reinicies el servidor, deberías ver en los logs:
- ✅ "Stripe configurado correctamente" (si todo está bien)
- ⚠️ O ningún error relacionado con Stripe

## 🧪 Probar

1. Crea un pedido desde el frontend
2. Selecciona método de pago "Tarjeta"
3. El sistema debería procesar el pago con Stripe

---

**Nota:** Si ves errores, verifica que:
- La clave esté correctamente copiada (sin espacios extra)
- El archivo `.env` esté en la carpeta `Backend/`
- Hayas reiniciado el servidor después de agregar la clave

