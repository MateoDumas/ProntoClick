# Regenerar Cliente de Prisma para Chat

## Problema

Si ves errores como:
```
Property 'chatSession' does not exist on type 'PrismaService'
Property 'chatMessage' does not exist on type 'PrismaService'
```

Es porque el cliente de Prisma no se ha regenerado después de agregar los nuevos modelos.

## Solución

### Opción 1: Detener el servidor y regenerar

1. **Detén el servidor de desarrollo** (Ctrl+C en la terminal donde está corriendo)

2. **Regenera el cliente de Prisma:**
```bash
cd Backend
npm run prisma:generate
```

3. **Vuelve a iniciar el servidor:**
```bash
npm run start:dev
```

### Opción 2: Si el error persiste

1. **Cierra todas las instancias del servidor y editores**

2. **Elimina la carpeta .prisma temporalmente:**
```bash
cd Backend
rm -rf node_modules/.prisma
# O en Windows PowerShell:
Remove-Item -Recurse -Force node_modules\.prisma
```

3. **Regenera:**
```bash
npm run prisma:generate
```

### Opción 3: Reiniciar completamente

1. **Detén el servidor**
2. **Cierra VS Code/Cursor**
3. **Abre de nuevo y ejecuta:**
```bash
cd Backend
npm run prisma:generate
npm run start:dev
```

## Verificación

Después de regenerar, los errores de TypeScript deberían desaparecer y deberías poder usar:
- `this.prisma.chatSession`
- `this.prisma.chatMessage`

## Nota

Si estás usando `npm run start:dev`, NestJS debería detectar los cambios y recompilar automáticamente después de regenerar Prisma.

