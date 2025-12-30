# 🎁 Guía: Promociones y Recompensas

Esta guía explica cómo funcionan las promociones y recompensas en ProntoClick, y cómo cargarlas en la base de datos.

---

## 📋 Resumen de Cambios

### ✅ Descuento de Bienvenida - Solo Una Vez

**Problema resuelto:** El descuento de bienvenida ahora solo aparece para usuarios que **nunca han hecho un pedido**. Una vez que un usuario completa su primer pedido, el descuento de bienvenida desaparece automáticamente.

**Aplicado a:**
- Promociones con código `BIENVENIDO15` o `BIENVENIDA10`
- Promociones con título que incluye "Bienvenida" o "Primera Compra"
- Cupón `BIENVENIDA10`

---

## 🚀 Cargar Promociones y Recompensas

### Opción 1: Cargar Todo (Recomendado)

```bash
cd Backend
npm run seed:all
```

Esto ejecutará:
- ✅ Seed de promociones (14 promociones)
- ✅ Seed de recompensas (10 recompensas)
- ✅ Seed de cupones (7 cupones)

### Opción 2: Cargar Individualmente

```bash
cd Backend

# Solo promociones
npm run seed:promotions

# Solo recompensas
npm run seed:rewards

# Solo cupones
npm run seed:coupons
```

---

## 📊 Promociones Cargadas

### Promociones por Día de la Semana

- **Lunes:** Lunes de Pizza (20% OFF)
- **Martes:** Martes de Sushi (15% OFF)
- **Miércoles:** Miércoles de Burgers (2x1)
- **Jueves:** Jueves de Tecnología (10% OFF)
- **Viernes:** Viernes Feliz (Envío gratis)
- **Sábado:** Sábado de Descuento (25% OFF)
- **Domingo:** Domingo Familiar (30% OFF)

### Promociones Disponibles Todos los Días

1. **Primera Compra** - 15% OFF (solo para usuarios sin pedidos)
2. **Descuento Flash** - 20% OFF en pedidos > $25
3. **Ahorro Semanal** - 12% OFF en todos los pedidos
4. **Super Ahorro** - $15 OFF en pedidos > $50
5. **Envío Gratis** - En pedidos > $25
6. **Combo Especial** - $10 OFF en combos

**Total: 14 promociones**

---

## 🎁 Recompensas Disponibles (ProntoPuntos)

Los usuarios pueden canjear puntos por estas recompensas:

### Cupones de Descuento
- **10% de Descuento** - 100 puntos
- **15% de Descuento** - 200 puntos
- **20% de Descuento** - 300 puntos
- **50% de Descuento** - 500 puntos
- **100% de Descuento** (Pedido GRATIS) - 1000 puntos

### Descuentos Fijos
- **$5 OFF** - 150 puntos
- **$10 OFF** - 250 puntos

### Beneficios Especiales
- **Envío Gratis** - 80 puntos
- **Bebida Gratis** - 50 puntos
- **Postre Gratis** - 75 puntos

**Total: 10 recompensas**

---

## 🎫 Cupones Disponibles

1. **BIENVENIDA10** - 10% OFF en primer pedido (solo para usuarios sin pedidos)
2. **DESCUENTO15** - 15% OFF en pedidos > $30
3. **FREESHIP** - Envío gratis en pedidos > $25
4. **FIXED5** - $5 OFF en pedidos > $15
5. **FIXED10** - $10 OFF en pedidos > $50
6. **VIP20** - 20% OFF exclusivo (1 uso por usuario)
7. **VIERNESGRATIS** - Envío gratis en pedidos > $30

**Total: 7 cupones**

---

## 🔧 Cómo Funciona el Filtro de Bienvenida

### En Promociones

El servicio `PromotionsService` verifica si el usuario tiene pedidos:

```typescript
// Si el usuario ya hizo al menos un pedido, filtrar promociones de bienvenida
if (userOrdersCount > 0) {
  promotions = promotions.filter(
    (promo) => 
      !promo.code?.toUpperCase().includes('BIENVENIDO') && 
      !promo.code?.toUpperCase().includes('BIENVENIDA') &&
      !promo.title.toLowerCase().includes('bienvenida') &&
      !promo.title.toLowerCase().includes('primera compra')
  );
}
```

### En Cupones

El servicio `CouponsService` filtra el cupón `BIENVENIDA10`:

```typescript
// Filtrar cupón de bienvenida si el usuario ya hizo pedidos
if (coupon.code?.toUpperCase() === 'BIENVENIDA10' && userOrdersCount > 0) {
  return false;
}
```

---

## 📝 Notas Importantes

- ⚠️ **El descuento de bienvenida solo aparece una vez** por usuario
- 🔄 **Los seeds eliminan datos anteriores** antes de insertar nuevos
- 📅 **Las promociones por día** se muestran según el día actual
- 🎯 **Las recompensas** se pueden canjear con ProntoPuntos
- 💳 **Los cupones** tienen límites de uso según su configuración

---

## ✅ Verificación

Después de ejecutar los seeds, verifica:

1. **Promociones:**
   ```sql
   SELECT COUNT(*) FROM "Promotion" WHERE "isActive" = true;
   -- Debería mostrar 14
   ```

2. **Recompensas:**
   ```sql
   SELECT COUNT(*) FROM "Reward" WHERE "isActive" = true;
   -- Debería mostrar 10
   ```

3. **Cupones:**
   ```sql
   SELECT COUNT(*) FROM "Coupon" WHERE "isActive" = true;
   -- Debería mostrar 7
   ```

---

## 🔄 Actualizar Promociones

Si necesitas agregar más promociones:

1. Edita `Backend/Prisma/seed-promotions.ts`
2. Agrega las nuevas promociones al array `promotions`
3. Ejecuta: `npm run seed:promotions`

**Nota:** Esto eliminará todas las promociones existentes y creará las nuevas.

---

¡Listo! Ahora tus usuarios verán promociones y recompensas, y el descuento de bienvenida solo aparecerá una vez. 🎉

