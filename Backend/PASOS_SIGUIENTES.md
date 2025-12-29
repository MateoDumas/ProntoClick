# ✅ Pasos Siguientes - Ya tienes PostgreSQL configurado

## 1. Crear la Base de Datos `prontoclick`

En pgAdmin, con el servidor "ProntoClick DB" expandido:

1. Click derecho en **"Databases"**
2. Selecciona **"Create"** → **"Database..."**
3. En el campo **"Database"** escribe: `prontoclick`
4. Click en **"Save"**

## 2. Crear el archivo `.env`

En la carpeta `Backend/`, crea un archivo llamado `.env` con este contenido:

```env
# Base de Datos - Ajusta según tu configuración
DATABASE_URL="postgresql://postgres:TU_CONTRASEÑA@localhost:5432/prontoclick?schema=public"

# JWT
JWT_SECRET="prontoclick-secret-key-2024-cambiar-en-produccion"
JWT_EXPIRES_IN="15m"

# Servidor
PORT=3001
FRONTEND_URL="http://localhost:3000"
```

**⚠️ IMPORTANTE:** 
- Reemplaza `TU_CONTRASEÑA` con la contraseña de PostgreSQL que configuraste
- Si usas un usuario diferente a `postgres`, cámbialo también
- Si el puerto es diferente a 5432, cámbialo

## 3. Instalar Dependencias del Backend

Abre una terminal en la carpeta `Backend/`:

```bash
cd Backend
npm install
```

## 4. Generar Cliente de Prisma

```bash
npm run prisma:generate
```

## 5. Ejecutar Migraciones (Crear las Tablas)

```bash
npm run prisma:migrate
```

Cuando te pregunte el nombre de la migración, puedes poner: `init` o simplemente presionar Enter.

Esto creará todas las tablas en tu base de datos:
- User
- Restaurant
- Product
- Order
- OrderItem

## 6. Verificar que Funcionó

Puedes abrir Prisma Studio para ver las tablas:

```bash
npm run prisma:studio
```

Esto abrirá una interfaz web en `http://localhost:5555` donde puedes ver todas las tablas (aunque estén vacías por ahora).

## 7. Iniciar el Backend

```bash
npm run start:dev
```

Deberías ver:
```
🚀 Backend running on http://localhost:3001
```

## ✅ Listo!

Ahora el backend estará corriendo y el frontend podrá conectarse. El mensaje de error en el registro desaparecerá.

## 🔍 Verificar la Conexión

Si todo está bien, cuando intentes registrarte desde el frontend:
- El error de conexión desaparecerá
- Podrás crear usuarios
- Los datos se guardarán en PostgreSQL

## 🆘 Si hay Errores

### Error: "password authentication failed"
- Verifica la contraseña en el `.env`
- Asegúrate de que el usuario `postgres` tenga esa contraseña

### Error: "database does not exist"
- Verifica que la base de datos `prontoclick` esté creada
- Revisa el nombre en `DATABASE_URL`

### Error: "relation does not exist"
- Ejecuta las migraciones: `npm run prisma:migrate`

