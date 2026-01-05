import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    // Agregar parámetro pgbouncer=true a la URL si no está presente
    // Esto deshabilita prepared statements para connection pooling
    const databaseUrl = process.env.DATABASE_URL || '';
    const urlWithPgbouncer = databaseUrl.includes('pgbouncer=true')
      ? databaseUrl
      : databaseUrl.includes('?')
      ? `${databaseUrl}&pgbouncer=true`
      : `${databaseUrl}?pgbouncer=true`;

    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'info' },
        { emit: 'event', level: 'warn' },
      ],
      errorFormat: 'pretty',
      datasources: {
        db: {
          url: urlWithPgbouncer,
        },
      },
    });

    // Manejar eventos de Prisma
    this.$on('error' as never, (e: any) => {
      this.logger.error('Prisma error:', e);
    });

    this.$on('warn' as never, (e: any) => {
      this.logger.warn('Prisma warning:', e);
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Database connected successfully');
    } catch (error) {
      this.logger.error('Failed to connect to database:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      this.logger.log('Database disconnected successfully');
    } catch (error) {
      this.logger.error('Error disconnecting from database:', error);
    }
  }

  /**
   * Ejecuta una transacción con manejo de errores mejorado
   */
  async executeTransaction<T>(fn: (tx: PrismaClient) => Promise<T>): Promise<T> {
    try {
      return await this.$transaction(fn, {
        maxWait: 5000, // 5 segundos máximo de espera
        timeout: 10000, // 10 segundos máximo de ejecución
      });
    } catch (error: any) {
      this.logger.error('Transaction error:', error);
      throw error;
    }
  }

  /**
   * Verifica la salud de la conexión
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      this.logger.error('Database health check failed:', error);
      return false;
    }
  }
}

