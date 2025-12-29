# Guía de Configuración del Backend

## 📋 Pasos para Configurar PostgreSQL

### 1. Instalar PostgreSQL

**Windows:**
- Descarga desde: https://www.postgresql.org/download/windows/
- O usa Chocolatey: `choco install postgresql`

**Mac:**
```bash
brew install postgresql
brew services start postgresql
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 2. Crear la Base de Datos

Abre una terminal de PostgreSQL o pgAdmin y ejecuta:

```sql
-- Conectar como usuario postgres
CREATE DATABASE prontoclick;

-- O desde la terminal:
createdb prontoclick
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la carpeta `Backend/` con el siguiente contenido:

```env
# Base de Datos PostgreSQL
# Formato: postgresql://usuario:contraseña@localhost:5432/nombre_base_datos
DATABASE_URL="postgresql://postgres:tu_contraseña@localhost:5432/prontoclick?schema=public"

# JWT
JWT_SECRET="cambia-este-secreto-por-uno-seguro-en-produccion"
JWT_EXPIRES_IN="15m"

# Servidor
PORT=3001
FRONTEND_URL="http://localhost:3000"
```

**⚠️ Importante:** Reemplaza `tu_contraseña` con la contraseña que configuraste para PostgreSQL.

### 4. Instalar Dependencias

```bash
cd Backend
npm install
```

### 5. Generar Cliente de Prisma

```bash
npm run prisma:generate
```

### 6. Ejecutar Migraciones

Esto creará todas las tablas en la base de datos:

```bash
npm run prisma:migrate
```

Cuando te pregunte el nombre de la migración, puedes poner: `init`

### 7. Iniciar el Servidor

```bash
npm run start:dev
```

Deberías ver: `🚀 Backend running on http://localhost:3001`

## 🔍 Verificar la Conexión

Puedes verificar que todo funciona abriendo Prisma Studio:

```bash
npm run prisma:studio
```

Esto abrirá una interfaz web en `http://localhost:5555` donde puedes ver y editar los datos.

## 🆘 Solución de Problemas

### Error: "password authentication failed"
- Verifica que la contraseña en `DATABASE_URL` sea correcta
- Si olvidaste la contraseña, puedes resetearla en PostgreSQL

### Error: "database does not exist"
- Asegúrate de haber creado la base de datos `prontoclick`
- Verifica el nombre en `DATABASE_URL`

### Error: "connection refused"
- Verifica que PostgreSQL esté corriendo
- En Windows: Busca "Services" y verifica que "postgresql-x64-XX" esté corriendo
- En Mac/Linux: `sudo systemctl status postgresql` o `brew services list`

## 📝 Ejemplo de DATABASE_URL

Si tu usuario de PostgreSQL es `postgres`, tu contraseña es `mipassword123`, y la base de datos es `prontoclick`:

```env
DATABASE_URL="postgresql://postgres:mipassword123@localhost:5432/prontoclick?schema=public"
```

## 🎯 Alternativa Rápida (Solo para Desarrollo)

Si quieres probar rápidamente sin instalar PostgreSQL, puedes cambiar temporalmente a SQLite:

1. En `Prisma/Schema.prisma`, cambia:
   ```prisma
   datasource db {
     provider = "sqlite"  // Cambiar de "postgresql" a "sqlite"
     url      = "file:./dev.db"
   }
   ```

2. Ejecuta las migraciones:
   ```bash
   npm run prisma:migrate
   ```

**Nota:** SQLite es solo para desarrollo. Para producción usa PostgreSQL.

