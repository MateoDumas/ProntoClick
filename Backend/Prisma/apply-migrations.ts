import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function applyMigrations() {
  console.log('🔄 Aplicando migraciones...\n');

  try {
    // Leer el archivo SQL
    const sqlFile = path.join(__dirname, 'apply-all-migrations.sql');
    const sql = fs.readFileSync(sqlFile, 'utf-8');

    // Dividir en statements individuales
    const statements = sql
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith('--'));

    // Ejecutar cada statement
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await prisma.$executeRawUnsafe(statement);
          console.log('✅ Ejecutado:', statement.substring(0, 50) + '...');
        } catch (error: any) {
          // Ignorar errores de "ya existe"
          if (!error.message.includes('already exists') && !error.message.includes('duplicate')) {
            console.warn('⚠️  Advertencia:', error.message);
          }
        }
      }
    }

    console.log('\n✨ Migraciones aplicadas correctamente!');
    console.log('📦 Ahora ejecuta: npx prisma generate');
  } catch (error) {
    console.error('❌ Error al aplicar migraciones:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

applyMigrations();

