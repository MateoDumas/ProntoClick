// src/auth/auth.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { ReferralsModule } from '../referrals/referrals.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { LocalAuthGuard } from './local-auth.guard';
import { TwoFactorService } from './two-factor.service';

@Module({
  imports: [
    // ConfigModule para poder acceder a las variables de entorno desde JwtModule.registerAsync
    ConfigModule,

    // Passport para facilitar uso de estrategias (JWT)
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // JwtModule configurado de forma asíncrona para leer secret/expires desde ConfigService
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET') || 'default_jwt_secret_change_me',
        signOptions: {
          // TTL del access token (ej: '15m'). Fallback por si no está en env.
          expiresIn: config.get<string>('JWT_EXPIRES_IN') || '15m',
        },
      }),
    }),

    // Importa UsersModule. Usamos forwardRef si UsersModule importa AuthModule en algún punto.
    forwardRef(() => UsersModule),
    NotificationsModule,
    ReferralsModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    TwoFactorService,
    JwtStrategy, // estrategia para validar JWT en requests entrantes
    LocalAuthGuard,
  ],
  exports: [
    AuthService,
    JwtModule, // exportamos JwtModule para que otros módulos puedan firmar/validar tokens si hace falta
  ],
})
export class AuthModule { }
