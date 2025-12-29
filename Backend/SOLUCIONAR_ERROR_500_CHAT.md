# Solución Error 500 en Chat

## Problema
Error 500 al intentar crear una sesión de chat:
```
Failed to load resource: the server responded with a status of 500 (Internal Server Error)
:3001/chat/sessions
```

## Causa
El cliente de Prisma no se ha regenerado después de agregar los modelos `ChatSession` y `ChatMessage`.

## Solución Rápida

### Paso 1: Detener el servidor
En la terminal donde está corriendo el backend, presiona `Ctrl+C`

### Paso 2: Regenerar Prisma
```bash
cd Backend
npm run prisma:generate
```

### Paso 3: Si hay error de permisos
Si ves un error como "EPERM: operation not permitted", cierra completamente:
- El servidor de desarrollo
- VS Code/Cursor
- Cualquier proceso de Node.js

Luego vuelve a ejecutar:
```bash
npm run prisma:generate
```

### Paso 4: Reiniciar el servidor
```bash
npm run start:dev
```

## Verificación

Después de regenerar, el servidor debería iniciar sin errores y el chat debería funcionar.

Si el error persiste, verifica en la consola del backend que no haya errores relacionados con Prisma.

