# 📝 Cómo Ejecutar el Script SQL en pgAdmin

## Pasos Detallados

### 1. Abrir Query Tool
1. En el panel izquierdo, **expande** la base de datos `prontoclick`
2. **Haz clic derecho** sobre la base de datos `prontoclick`
3. Selecciona **"Query Tool"** (o "Herramienta de Consulta")
   - También puedes usar el atajo: Click derecho → Query Tool

### 2. Abrir el Script SQL
1. En pgAdmin, ve al menú **"File"** → **"Open File"** (o presiona `Ctrl+O`)
2. Navega a: `Backend/Prisma/create-chat-tables-only.sql`
3. Selecciona el archivo y ábrelo

**O también puedes:**
- Abrir el archivo `create-chat-tables-only.sql` en tu editor de código
- Copiar todo el contenido (Ctrl+A, Ctrl+C)
- Pegarlo en el Query Tool de pgAdmin (Ctrl+V)

### 3. Ejecutar el Script
1. Asegúrate de estar conectado a la base de datos `prontoclick`
2. Haz clic en el botón **"Execute"** (⚡) en la barra de herramientas
   - O presiona `F5`
   - O usa el menú: **Query** → **Execute**

### 4. Verificar el Resultado
- Deberías ver mensajes como:
  - `NOTICE: Tabla ChatSession creada`
  - `NOTICE: Tabla ChatMessage creada`
- Si las tablas ya existían, verás:
  - `NOTICE: Tabla ChatSession ya existe`
  - `NOTICE: Tabla ChatMessage ya existe`

### 5. Verificar que las Tablas se Crearon
1. En el panel izquierdo, expande: `prontoclick` → `Schemas` → `public` → `Tables`
2. Deberías ver:
   - `ChatSession`
   - `ChatMessage`

## Ubicación del Archivo SQL

El archivo está en:
```
Backend/Prisma/create-chat-tables-only.sql
```

## Atajos Útiles

- **Abrir Query Tool**: Click derecho en la base de datos → Query Tool
- **Ejecutar Query**: `F5`
- **Abrir archivo**: `Ctrl+O`
- **Copiar todo**: `Ctrl+A` → `Ctrl+C`
- **Pegar**: `Ctrl+V`

## Si Hay Errores

Si ves algún error, compártelo y te ayudo a solucionarlo. Los errores más comunes son:
- **"ya existe"**: Las tablas ya están creadas (está bien, significa que funcionó antes)
- **"permiso denegado"**: Necesitas permisos de administrador en la base de datos
- **"no existe la tabla User"**: Necesitas crear primero la tabla User (pero debería existir)

