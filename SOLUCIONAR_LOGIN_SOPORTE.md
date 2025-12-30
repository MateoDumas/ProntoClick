# 🔧 Solución: Problema de Login de Soporte

Si tienes problemas para iniciar sesión como usuario de soporte (credenciales inválidas), sigue estos pasos:

## 🔍 Diagnóstico

El problema puede deberse a:
1. El usuario de soporte no existe en la base de datos
2. La contraseña no está hasheada correctamente
3. La contraseña fue cambiada y no coincide con la esperada
4. El email del usuario no coincide con el esperado

---

## ✅ Solución Rápida: Resetear Contraseña

### Opción 1: Usar el Script de Reset (Recomendado)

1. **Ve a la carpeta Backend:**
   ```bash
   cd Backend
   ```

2. **Ejecuta el script de reset:**
   ```bash
   npm run reset:support
   ```

   O con credenciales personalizadas:
   ```bash
   SUPPORT_EMAIL=soporte@prontoclick.com SUPPORT_PASSWORD=TuPassword123! npm run reset:support
   ```

3. **El script hará lo siguiente:**
   - Buscará el usuario de soporte existente
   - Si no existe, lo creará
   - Reseteará la contraseña a la especificada (o la por defecto)
   - Verificará que la contraseña funcione correctamente

4. **Credenciales por defecto:**
   - Email: `soporte@prontoclick.com`
   - Password: `Soporte123!`

5. **Intenta iniciar sesión nuevamente** con las credenciales mostradas.

---

### Opción 2: Crear Usuario Nuevo

Si prefieres crear un usuario completamente nuevo:

1. **Elimina el usuario de soporte existente** (opcional, solo si quieres empezar de cero):
   - Ve a Supabase → Table Editor → `User`
   - Busca el usuario con `role = 'support'`
   - Elimínalo

2. **Ejecuta el script de creación:**
   ```bash
   cd Backend
   npm run create:support
   ```

---

## 🔐 Verificar Manualmente en Supabase

Si quieres verificar manualmente:

1. **Ve a Supabase → SQL Editor**

2. **Ejecuta esta consulta para ver el usuario de soporte:**
   ```sql
   SELECT id, email, name, role, "createdAt"
   FROM "User"
   WHERE role = 'support';
   ```

3. **Si el usuario existe pero la contraseña no funciona:**
   - Ejecuta el script de reset: `npm run reset:support`
   - O elimina el usuario y créalo de nuevo

---

## 🐛 Solución de Problemas

### Error: "Credenciales inválidas" después del reset

1. **Verifica que el servidor backend esté corriendo:**
   ```bash
   cd Backend
   npm run start:dev
   ```

2. **Verifica que la base de datos esté conectada:**
   - Revisa el archivo `.env` en `Backend/.env`
   - Verifica que `DATABASE_URL` esté correcto

3. **Verifica que el usuario existe:**
   ```sql
   SELECT * FROM "User" WHERE role = 'support';
   ```

4. **Verifica que la contraseña esté hasheada:**
   - La contraseña en la base de datos debe ser un hash (empieza con `$2b$10$...`)
   - Si ves la contraseña en texto plano, ejecuta el script de reset

### Error: "Usuario no encontrado"

1. **Crea el usuario de soporte:**
   ```bash
   cd Backend
   npm run create:support
   ```

2. **O usa el script de reset que crea el usuario si no existe:**
   ```bash
   npm run reset:support
   ```

### Error: "El email ya está en uso"

1. **El script de reset actualizará el usuario existente**
2. **O elimina el usuario existente y créalo de nuevo**

---

## 📝 Notas Importantes

- ⚠️ **Cambia la contraseña después del primer inicio de sesión** por seguridad
- 🔒 Las contraseñas se hashean con `bcrypt` (10 rounds)
- 📧 El email por defecto es `soporte@prontoclick.com`
- 🔑 La contraseña por defecto es `Soporte123!`

---

## ✅ Verificación Final

Después de ejecutar el script, deberías poder:

1. ✅ Iniciar sesión con las credenciales mostradas
2. ✅ Acceder al dashboard de soporte en `/support/dashboard`
3. ✅ Ver tu rol como `support` en el perfil

---

¿Sigue sin funcionar? Verifica:
- Que el servidor backend esté corriendo
- Que la base de datos esté conectada
- Que el usuario tenga `role = 'support'` en la base de datos
- Que la contraseña esté hasheada (no en texto plano)

