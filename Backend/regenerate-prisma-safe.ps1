# Script seguro para regenerar Prisma
# Verifica procesos y ofrece opciones

Write-Host "🔍 Verificando procesos de Node.js..." -ForegroundColor Cyan

$nodeProcesses = Get-Process -Name node -ErrorAction SilentlyContinue | Where-Object {
    $_.Path -like "*nodejs*" -and $_.Path -notlike "*cursor*" -and $_.Path -notlike "*adobe*"
}

if ($nodeProcesses) {
    Write-Host "⚠️  Se encontraron procesos de Node.js que podrían estar bloqueando Prisma:" -ForegroundColor Yellow
    $nodeProcesses | Format-Table Id, ProcessName, Path -AutoSize
    
    Write-Host "`n💡 Opciones:" -ForegroundColor Cyan
    Write-Host "1. Detener todos los procesos de Node.js (recomendado si es el servidor)" -ForegroundColor White
    Write-Host "2. Intentar regenerar de todas formas" -ForegroundColor White
    Write-Host "3. Cancelar" -ForegroundColor White
    
    $choice = Read-Host "`nSelecciona una opción (1-3)"
    
    switch ($choice) {
        "1" {
            Write-Host "`n🛑 Deteniendo procesos de Node.js..." -ForegroundColor Yellow
            $nodeProcesses | ForEach-Object {
                try {
                    Stop-Process -Id $_.Id -Force
                    Write-Host "✅ Proceso $($_.Id) detenido" -ForegroundColor Green
                } catch {
                    Write-Host "⚠️  No se pudo detener proceso $($_.Id): $_" -ForegroundColor Yellow
                }
            }
            Start-Sleep -Seconds 2
            Write-Host "`n🔄 Regenerando Prisma..." -ForegroundColor Cyan
            npx prisma generate --schema=Prisma/Schema.prisma
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ Prisma regenerado exitosamente!" -ForegroundColor Green
            }
        }
        "2" {
            Write-Host "`n🔄 Intentando regenerar Prisma..." -ForegroundColor Cyan
            npx prisma generate --schema=Prisma/Schema.prisma
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ Prisma regenerado exitosamente!" -ForegroundColor Green
            } else {
                Write-Host "❌ Error. Por favor detén el servidor manualmente y vuelve a intentar." -ForegroundColor Red
            }
        }
        "3" {
            Write-Host "Operación cancelada." -ForegroundColor Yellow
            exit 0
        }
        default {
            Write-Host "Opción inválida. Cancelando." -ForegroundColor Red
            exit 1
        }
    }
} else {
    Write-Host "✅ No se encontraron procesos de Node.js bloqueando" -ForegroundColor Green
    Write-Host "🔄 Regenerando Prisma..." -ForegroundColor Cyan
    npx prisma generate --schema=Prisma/Schema.prisma
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Prisma regenerado exitosamente!" -ForegroundColor Green
    }
}

