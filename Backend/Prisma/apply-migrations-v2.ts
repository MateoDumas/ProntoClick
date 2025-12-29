import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function applyMigrations() {
  console.log('🔄 Aplicando migraciones...\n');

  try {
    // Leer el archivo SQL
    const sqlFile = path.join(__dirname, 'apply-migrations-simple.sql');
    const sql = fs.readFileSync(sqlFile, 'utf-8');

    // Ejecutar todo el SQL de una vez
    await prisma.$executeRawUnsafe(sql);

    console.log('\n✨ Migraciones aplicadas correctamente!');
    console.log('📦 Regenerando Prisma Client...\n');
    
    // Regenerar Prisma Client
    const { execSync } = require('child_process');
    execSync('npx prisma generate', { cwd: path.join(__dirname, '..'), stdio: 'inherit' });
    
    console.log('\n✅ ¡Todo listo! Reinicia el backend.');
  } catch (error: any) {
    console.error('❌ Error al aplicar migraciones:', error.message);
    // Intentar regenerar Prisma Client de todas formas
    try {
      const { execSync } = require('child_process');
      execSync('npx prisma generate', { cwd: path.join(__dirname, '..'), stdio: 'inherit' });
    } catch (e) {
      console.error('Error al regenerar Prisma Client:', e);
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

applyMigrations();

