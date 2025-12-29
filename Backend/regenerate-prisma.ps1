# Script para regenerar el cliente de Prisma
# Ejecutar este script DESPUÉS de detener el servidor de desarrollo

Write-Host "🔄 Regenerando cliente de Prisma..." -ForegroundColor Cyan

try {
    npx prisma generate --schema=Prisma/Schema.prisma
    Write-Host "✅ Cliente de Prisma regenerado exitosamente!" -ForegroundColor Green
    Write-Host "✨ Ahora puedes reiniciar el servidor de desarrollo" -ForegroundColor Yellow
} catch {
    Write-Host "❌ Error al regenerar Prisma: $_" -ForegroundColor Red
    Write-Host "💡 Asegúrate de que el servidor de desarrollo esté detenido" -ForegroundColor Yellow
}

