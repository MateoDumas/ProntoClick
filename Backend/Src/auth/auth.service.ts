import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { NotificationsService } from '../notifications/notifications.service';
import { ReferralsService } from '../referrals/referrals.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private notificationsService: NotificationsService,
    private referralsService: ReferralsService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    const { password: _, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      user,
      token: this.jwtService.sign(payload),
    };
  }

  async register(data: { email: string; password: string; name: string; referralCode?: string }) {
    // Verificar si el usuario ya existe
    const existingUser = await this.usersService.findByEmail(data.email);
    if (existingUser) {
      throw new UnauthorizedException('El email ya está registrado');
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Crear usuario
    const user = await this.usersService.create({
      ...data,
      password: hashedPassword,
    });

    // Procesar código de referido si existe
    if (data.referralCode) {
      try {
        await this.referralsService.processReferral(data.referralCode, user.id);
      } catch (error) {
        console.error('Error al procesar código de referido:', error);
        // No fallar el registro si hay error con el código de referido
      }
    }

    // Generar código de referido para el nuevo usuario
    try {
      await this.referralsService.generateReferralCode(user.id);
    } catch (error) {
      console.error('Error al generar código de referido:', error);
    }

    const { password: _, ...userWithoutPassword } = user;
    const payload = { email: user.email, sub: user.id };

    // Enviar email de bienvenida (no bloquea el registro si falla)
    try {
      await this.notificationsService.sendWelcomeEmail(user.email, user.name);
    } catch (error) {
      console.error('Error al enviar email de bienvenida:', error);
      // No fallar el registro si hay error con el email
    }

    return {
      user: userWithoutPassword,
      token: this.jwtService.sign(payload),
    };
  }
}

