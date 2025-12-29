#!/usr/bin/env node

/**
 * Script de verificación pre-deployment
 * Verifica que todo esté listo para producción
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const errors = [];
const warnings = [];
const checks = [];

console.log('🔍 Verificando preparación para deployment...\n');

// 1. Verificar archivo .env
function checkEnvFile() {
  const envPath = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) {
    errors.push('❌ Archivo .env no encontrado');
    return false;
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  // Variables críticas requeridas
  const requiredVars = ['DATABASE_URL', 'JWT_SECRET'];
  const missingVars = [];
  
  requiredVars.forEach(varName => {
    if (!envContent.includes(`${varName}=`)) {
      missingVars.push(varName);
    }
  });
  
  if (missingVars.length > 0) {
    errors.push(`❌ Variables de entorno faltantes: ${missingVars.join(', ')}`);
    return false;
  }
  
  // Verificar valores inseguros
  if (envContent.includes('default_jwt_secret_change_me') || 
      envContent.includes('your-secret-key') ||
      envContent.includes('cambia-este-secreto')) {
    warnings.push('⚠️  JWT_SECRET parece usar un valor por defecto inseguro');
  }
  
  // Verificar NODE_ENV (opcional pero recomendado)
  if (!envContent.includes('NODE_ENV=')) {
    warnings.push('⚠️  NODE_ENV no está configurado (se usará "development" por defecto)');
  } else if (envContent.includes('NODE_ENV=development') && envContent.includes('DATABASE_URL') && 
      !envContent.includes('localhost')) {
    warnings.push('⚠️  NODE_ENV=development pero DATABASE_URL apunta a producción');
  }
  
  // Verificar que en producción NODE_ENV esté configurado
  if (envContent.includes('NODE_ENV=production')) {
    checks.push('✅ NODE_ENV configurado para producción');
  }
  
  checks.push('✅ Archivo .env encontrado y configurado');
  return true;
}

// 2. Verificar build
function checkBuild() {
  try {
    console.log('📦 Verificando build...');
    execSync('npm run build', { 
      cwd: path.join(__dirname, '..'),
      stdio: 'pipe'
    });
    checks.push('✅ Build exitoso');
    return true;
  } catch (error) {
    errors.push('❌ Build falló. Ejecuta "npm run build" para ver errores');
    return false;
  }
}

// 3. Verificar Prisma
function checkPrisma() {
  try {
    console.log('🗄️  Verificando Prisma...');
    execSync('npx prisma generate', { 
      cwd: path.join(__dirname, '..'),
      stdio: 'pipe'
    });
    checks.push('✅ Prisma client generado correctamente');
    return true;
  } catch (error) {
    errors.push('❌ Error al generar Prisma client');
    return false;
  }
}

// 4. Verificar dependencias
function checkDependencies() {
  const packageJsonPath = path.join(__dirname, '..', 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    errors.push('❌ package.json no encontrado');
    return false;
  }
  
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const requiredDeps = [
    '@nestjs/core',
    '@prisma/client',
    'helmet',
    '@nestjs/throttler',
    'winston'
  ];
  
  const missingDeps = requiredDeps.filter(dep => {
    return !packageJson.dependencies?.[dep] && !packageJson.devDependencies?.[dep];
  });
  
  if (missingDeps.length > 0) {
    warnings.push(`⚠️  Dependencias recomendadas faltantes: ${missingDeps.join(', ')}`);
  } else {
    checks.push('✅ Dependencias principales instaladas');
  }
  
  return true;
}

// 5. Verificar estructura de directorios
function checkDirectories() {
  const requiredDirs = [
    'src',
    'Prisma',
    'dist'
  ];
  
  const missingDirs = requiredDirs.filter(dir => {
    const dirPath = path.join(__dirname, '..', dir);
    return !fs.existsSync(dirPath);
  });
  
  if (missingDirs.length > 0) {
    warnings.push(`⚠️  Directorios faltantes: ${missingDirs.join(', ')}`);
  } else {
    checks.push('✅ Estructura de directorios correcta');
  }
  
  return true;
}

// Ejecutar todas las verificaciones
checkEnvFile();
checkDependencies();
checkDirectories();
checkPrisma();
checkBuild();

// Mostrar resultados
console.log('\n📊 Resultados:\n');

if (checks.length > 0) {
  console.log('✅ Verificaciones exitosas:');
  checks.forEach(check => console.log(`   ${check}`));
  console.log('');
}

if (warnings.length > 0) {
  console.log('⚠️  Advertencias:');
  warnings.forEach(warning => console.log(`   ${warning}`));
  console.log('');
}

if (errors.length > 0) {
  console.log('❌ Errores encontrados:');
  errors.forEach(error => console.log(`   ${error}`));
  console.log('');
  console.log('❌ Deployment NO recomendado. Corrige los errores antes de continuar.');
  process.exit(1);
} else {
  console.log('✅ ¡Todo listo para deployment!');
  if (warnings.length > 0) {
    console.log('⚠️  Revisa las advertencias antes de continuar.');
  }
  process.exit(0);
}

