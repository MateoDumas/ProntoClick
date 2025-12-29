import { LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import { format } from 'winston';

/**
 * Logger personalizado usando Winston
 * Compatible con NestJS LoggerService
 */
export class WinstonLogger implements LoggerService {
  private logger: winston.Logger;

  constructor() {
    const isProduction = process.env.NODE_ENV === 'production';

    this.logger = winston.createLogger({
      level: isProduction ? 'info' : 'debug',
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.errors({ stack: true }),
        format.splat(),
        format.json(),
      ),
      defaultMeta: {
        service: 'prontoclick-backend',
        environment: process.env.NODE_ENV || 'development',
      },
      transports: [
        // Console transport - siempre activo
        new winston.transports.Console({
          format: format.combine(
            format.colorize(),
            format.printf(({ timestamp, level, message, context, ...meta }) => {
              const contextStr = context ? `[${context}]` : '';
              const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : '';
              return `${timestamp} ${level} ${contextStr} ${message} ${metaStr}`;
            }),
          ),
        }),
        // File transport para errores - solo en producción
        ...(isProduction
          ? [
              new winston.transports.File({
                filename: 'logs/error.log',
                level: 'error',
                format: format.combine(format.timestamp(), format.json()),
                maxsize: 5242880, // 5MB
                maxFiles: 5,
              }),
              new winston.transports.File({
                filename: 'logs/combined.log',
                format: format.combine(format.timestamp(), format.json()),
                maxsize: 5242880, // 5MB
                maxFiles: 5,
              }),
            ]
          : []),
      ],
      // Manejo de excepciones no capturadas
      exceptionHandlers: [
        new winston.transports.File({
          filename: 'logs/exceptions.log',
          format: format.combine(format.timestamp(), format.json()),
        }),
      ],
      // Manejo de promesas rechazadas
      rejectionHandlers: [
        new winston.transports.File({
          filename: 'logs/rejections.log',
          format: format.combine(format.timestamp(), format.json()),
        }),
      ],
    });
  }

  log(message: string, context?: string) {
    this.logger.info(message, { context });
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, { trace, context });
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, { context });
  }

  verbose(message: string, context?: string) {
    this.logger.verbose(message, { context });
  }
}

