const fs = require('fs');
const path = require('path');

console.log('=== VERIFICANDO ESTRUCTURA DEL BUILD ===\n');

const distPath = path.join(__dirname, '..', 'dist');

if (!fs.existsSync(distPath)) {
  console.log('❌ El directorio dist/ no existe');
  process.exit(1);
}

console.log('✅ El directorio dist/ existe\n');

// Listar todos los archivos
function listFiles(dir, baseDir = dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...listFiles(fullPath, baseDir));
    } else {
      const relativePath = path.relative(baseDir, fullPath);
      files.push(relativePath);
    }
  }
  
  return files;
}

const allFiles = listFiles(distPath);
console.log('📁 Archivos en dist/:');
allFiles.forEach(file => console.log(`   - ${file}`));

console.log('\n🔍 Buscando archivos main:');
const mainFiles = allFiles.filter(f => f.toLowerCase().includes('main'));
if (mainFiles.length > 0) {
  mainFiles.forEach(file => console.log(`   ✅ ${file}`));
} else {
  console.log('   ❌ No se encontraron archivos main');
}

console.log('\n📂 Estructura de directorios en dist/:');
const dirs = fs.readdirSync(distPath).filter(item => {
  const fullPath = path.join(distPath, item);
  return fs.statSync(fullPath).isDirectory();
});
dirs.forEach(dir => console.log(`   - ${dir}/`));

console.log('\n=== VERIFICACIÓN COMPLETA ===');

