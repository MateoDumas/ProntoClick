/**
 * Validador de variables de entorno críticas
 * Se ejecuta al iniciar la aplicación para asegurar que todas las variables necesarias estén configuradas
 */

export function validateEnv() {
  const requiredEnvVars = {
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
  };

  const missingVars: string[] = [];

  for (const [key, value] of Object.entries(requiredEnvVars)) {
    if (!value || value.trim() === '') {
      missingVars.push(key);
    }
  }

  // Validar JWT_SECRET no sea el valor por defecto en producción
  if (process.env.NODE_ENV === 'production') {
    const defaultSecrets = [
      'default_jwt_secret_change_me',
      'your-secret-key',
      'prontoclick-secret-key-2024-cambiar-en-produccion',
    ];
    
    if (defaultSecrets.includes(process.env.JWT_SECRET || '')) {
      throw new Error(
        '❌ JWT_SECRET no puede usar un valor por defecto en producción. ' +
        'Por favor, genera un secreto seguro y configúralo en las variables de entorno.'
      );
    }

    // Validar que JWT_SECRET tenga al menos 32 caracteres en producción
    if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
      console.warn(
        '⚠️  ADVERTENCIA: JWT_SECRET debería tener al menos 32 caracteres para mayor seguridad.'
      );
    }
  }

  if (missingVars.length > 0) {
    throw new Error(
      `❌ Variables de entorno faltantes: ${missingVars.join(', ')}\n` +
      'Por favor, configura estas variables en tu archivo .env'
    );
  }

  // Advertencias para variables opcionales pero recomendadas
  const warnings: string[] = [];

  if (!process.env.FRONTEND_URL) {
    warnings.push('FRONTEND_URL no está configurado, usando valor por defecto: http://localhost:3000');
  }

  if (process.env.NODE_ENV === 'production' && !process.env.FRONTEND_URL?.startsWith('https://')) {
    warnings.push('⚠️  ADVERTENCIA: FRONTEND_URL debería usar HTTPS en producción');
  }

  if (warnings.length > 0) {
    warnings.forEach(warning => console.warn(warning));
  }

  console.log('✅ Variables de entorno validadas correctamente');
}

