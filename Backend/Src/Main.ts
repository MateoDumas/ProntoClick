import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import helmet from 'helmet';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './App.module';
import { AllExceptionsFilter } from './common/http-exception.filter';
import { validateEnv } from './common/env.validator';
import { WinstonLogger } from './common/logger.config';

// Importación de compression (CommonJS)
const compression = require('compression');

async function bootstrap() {
  // Validar variables de entorno antes de iniciar
  try {
    validateEnv();
  } catch (error) {
    console.error('❌ Error en validación de variables de entorno:', error);
    process.exit(1);
  }

  // Crear aplicación con logger estructurado
  const app = await NestFactory.create(AppModule, {
    logger: new WinstonLogger(),
  });

  // ========== SEGURIDAD ==========
  
  // Helmet - Headers de seguridad HTTP
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'https:'],
        },
      },
      crossOriginEmbedderPolicy: false, // Necesario para Socket.io
    }),
  );

  // Compresión de respuestas (gzip)
  app.use(compression());

  // CORS configurado
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // ========== VALIDACIÓN Y ERRORES ==========

  // Validación global de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      // En producción, no exponer detalles de validación
      disableErrorMessages: process.env.NODE_ENV === 'production',
    }),
  );

  // Exception Filter global - Manejo centralizado de errores
  app.useGlobalFilters(new AllExceptionsFilter());

  // ========== SWAGGER/OPENAPI ==========
  
  // Documentación de API (solo en desarrollo o con autenticación en producción)
  if (process.env.NODE_ENV !== 'production' || process.env.ENABLE_SWAGGER === 'true') {
    const config = new DocumentBuilder()
      .setTitle('ProntoClick API')
      .setDescription('API REST para la aplicación ProntoClick - Sistema de delivery de comida')
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Ingresa el token JWT',
          in: 'header',
        },
        'JWT-auth', // Este nombre se usará en los decoradores @ApiBearerAuth('JWT-auth')
      )
      .addTag('auth', 'Endpoints de autenticación')
      .addTag('users', 'Gestión de usuarios')
      .addTag('restaurants', 'Gestión de restaurantes')
      .addTag('orders', 'Gestión de pedidos')
      .addTag('chat', 'Sistema de chat y soporte')
      .addTag('support', 'Dashboard de soporte')
      .addTag('reports', 'Sistema de reportes')
      .addTag('health', 'Health checks')
      .build();
    
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true, // Mantener token en sesión
      },
    });
  }

  // ========== WEBSOCKETS ==========
  
  // Configurar adaptador de Socket.io
  app.useWebSocketAdapter(new IoAdapter(app));

  // ========== INICIO DEL SERVIDOR ==========

  const port = process.env.PORT || 3001;
  const environment = process.env.NODE_ENV || 'development';
  
  await app.listen(port);
  
  const logger = new Logger('Bootstrap');
  logger.log(`🚀 Backend running on http://localhost:${port}`);
  logger.log(`📦 Environment: ${environment}`);
  logger.log(`🔒 Security: Helmet enabled`);
  logger.log(`⚡ Compression: Enabled`);
  logger.log(`🛡️  Rate Limiting: Enabled (100 req/min)`);
  logger.log(`💚 Health Check: http://localhost:${port}/health`);
  if (process.env.NODE_ENV !== 'production' || process.env.ENABLE_SWAGGER === 'true') {
    logger.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
  }
}

bootstrap().catch((error) => {
  console.error('❌ Error al iniciar la aplicación:');
  console.error('Error message:', error?.message || error);
  console.error('Error stack:', error?.stack);
  console.error('Full error:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
  process.exit(1);
});

