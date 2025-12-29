# 🔑 Diferencia entre Stripe Keys

## 📋 Tipos de API Keys de Stripe

Stripe tiene **2 tipos de keys**:

### 1. 🔓 Publishable Key (pk_test_...)
- **Uso:** Frontend (público, visible en el código)
- **Formato:** `pk_test_...` o `pk_live_...`
- **Seguridad:** Puede estar en el código del frontend
- **Para qué sirve:** Crear PaymentIntents desde el cliente

### 2. 🔒 Secret Key (sk_test_...)
- **Uso:** Backend (privado, NUNCA en el frontend)
- **Formato:** `sk_test_...` o `sk_live_...`
- **Seguridad:** NUNCA debe estar en el frontend, solo en el servidor
- **Para qué sirve:** Procesar pagos, confirmar transacciones

---

## ✅ Lo que tienes ahora

Tienes la **Publishable Key**:
```
pk_test_51SifU5K2b7y9pafVLYXDUuLUpFzDdUYNy0JMDxe2ua7UA9slrnE3DqpbpvFrZ19NNStlGYonsZNjOMs75CKeRwOo00qmozqdjS
```

**Esto es para el frontend** (opcional por ahora).

---

## ⚠️ Lo que necesitas

Necesitas la **Secret Key** que empieza con `sk_test_...`

### Cómo obtenerla:

1. **Ve al Dashboard de Stripe:**
   - Link: https://dashboard.stripe.com/apikeys

2. **En la sección "Secret key":**
   - Verás algo como: `sk_test_...` (oculta)
   - Click en **"Reveal test key"** para verla completa

3. **Copia la Secret Key completa:**
   - Debe empezar con `sk_test_`
   - Es mucho más larga que la publishable key

4. **Agrega en `Backend/.env`:**
   ```env
   STRIPE_SECRET_KEY=sk_test_tu_secret_key_completa_aqui
   ```

---

## 📝 Configuración Completa

### Backend (.env)
```env
STRIPE_SECRET_KEY=sk_test_...  # ← Esta es la que necesitas
```

### Frontend (.env.local) - Opcional
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51SifU5K2b7y9pafVLYXDUuLUpFzDdUYNy0JMDxe2ua7UA9slrnE3DqpbpvFrZ19NNStlGYonsZNjOMs75CKeRwOo00qmozqdjS
```

---

## 🔒 Seguridad

- ✅ **Publishable Key (pk_test_...):** Puede estar en el frontend
- ❌ **Secret Key (sk_test_...):** NUNCA en el frontend, solo en el servidor

---

## 🆘 ¿No encuentras la Secret Key?

1. Asegúrate de estar en el modo **"Test"** (no "Live")
2. Busca la sección **"Secret key"** (no "Publishable key")
3. Click en **"Reveal test key"** para verla
4. Si no la ves, puede que necesites permisos de administrador en la cuenta

---

**Link directo:** https://dashboard.stripe.com/apikeys

