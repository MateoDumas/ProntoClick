import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { NotificationsService } from '../notifications/notifications.service';
import { ReferralsService } from '../referrals/referrals.service';
import { TwoFactorService } from './two-factor.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private notificationsService: NotificationsService,
    private referralsService: ReferralsService,
    private twoFactorService: TwoFactorService,
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
    // Verificar si el usuario tiene 2FA activado
    const fullUser = await this.usersService.findById(user.id);
    if (fullUser?.twoFactorEnabled) {
      // Retornar sin token, indicando que se requiere 2FA
      return {
        user,
        requiresTwoFactor: true,
      };
    }

    // Si no tiene 2FA, retornar token normalmente
    const payload = { email: user.email, sub: user.id };
    return {
      user,
      token: this.jwtService.sign(payload),
      requiresTwoFactor: false,
    };
  }

  async verifyTwoFactorAndLogin(userId: string, code: string) {
    // Verificar código 2FA
    await this.twoFactorService.verifyCode(userId, code);

    // Obtener usuario completo
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const { password: _, ...userWithoutPassword } = user;
    const payload = { email: user.email, sub: user.id };

    return {
      user: userWithoutPassword,
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

    // Generar código de verificación (6 dígitos)
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationCodeExpires = new Date();
    verificationCodeExpires.setMinutes(verificationCodeExpires.getMinutes() + 15); // Expira en 15 minutos

    // Extraer referralCode antes de crear el usuario (no debe incluirse en la creación)
    const referralCodeToProcess = data.referralCode;
    
    // Crear usuario (sin referralCode, ya que ese campo es para el código propio del usuario)
    const user = await this.usersService.create({
      email: data.email,
      password: hashedPassword,
      name: data.name,
      emailVerified: false,
      verificationCode,
      verificationCodeExpires,
    });

    // Procesar código de referido si existe (este es el código de OTRO usuario)
    if (referralCodeToProcess) {
      try {
        await this.referralsService.processReferral(referralCodeToProcess, user.id);
      } catch (error) {
        console.error('Error al procesar código de referido:', error);
        // No fallar el registro si hay error con el código de referido
      }
    }

    // Generar código de referido único para el nuevo usuario (su propio código para compartir)
    try {
      await this.referralsService.generateReferralCode(user.id);
    } catch (error) {
      console.error('Error al generar código de referido:', error);
      // No fallar el registro si hay error generando el código
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

    // Enviar código de verificación (no bloquea el registro si falla)
    try {
      await this.notificationsService.sendVerificationCodeEmail(user.email, user.name, verificationCode);
    } catch (error) {
      console.error('Error al enviar código de verificación:', error);
      // No fallar el registro si hay error con el email
    }

    return {
      user: userWithoutPassword,
      token: this.jwtService.sign(payload),
      requiresVerification: true,
    };
  }

  async verifyEmail(userId: string, code: string): Promise<boolean> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    if (user.emailVerified) {
      return true; // Ya está verificado
    }

    if (!user.verificationCode || !user.verificationCodeExpires) {
      throw new UnauthorizedException('Código de verificación no encontrado');
    }

    if (new Date() > user.verificationCodeExpires) {
      throw new UnauthorizedException('El código de verificación ha expirado');
    }

    if (user.verificationCode !== code) {
      throw new UnauthorizedException('Código de verificación incorrecto');
    }

    // Verificar el email
    await this.usersService.update(userId, {
      emailVerified: true,
      verificationCode: null,
      verificationCodeExpires: null,
    });

    return true;
  }

  async resendVerificationCode(userId: string): Promise<boolean> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    if (user.emailVerified) {
      throw new UnauthorizedException('El email ya está verificado');
    }

    // Generar nuevo código de verificación
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationCodeExpires = new Date();
    verificationCodeExpires.setMinutes(verificationCodeExpires.getMinutes() + 15);

    // Actualizar usuario con nuevo código
    await this.usersService.update(userId, {
      verificationCode,
      verificationCodeExpires,
    });

    // Enviar email con nuevo código
    try {
      await this.notificationsService.sendVerificationCodeEmail(user.email, user.name, verificationCode);
      return true;
    } catch (error) {
      console.error('Error al reenviar código de verificación:', error);
      throw new UnauthorizedException('Error al enviar código de verificación');
    }
  }

  async requestPasswordReset(email: string): Promise<boolean> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      // Por seguridad, no revelamos si el email existe o no
      return true;
    }

    // Generar código de reset (6 dígitos)
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const resetCodeExpires = new Date();
    resetCodeExpires.setMinutes(resetCodeExpires.getMinutes() + 15); // Expira en 15 minutos

    // Actualizar usuario con código de reset
    await this.usersService.update(user.id, {
      passwordResetCode: resetCode,
      passwordResetCodeExpires: resetCodeExpires,
    });

    // Enviar email con código de reset
    try {
      await this.notificationsService.sendPasswordResetEmail(user.email, user.name, resetCode);
      return true;
    } catch (error) {
      console.error('Error al enviar email de reset de contraseña:', error);
      throw new UnauthorizedException('Error al enviar email de recuperación');
    }
  }

  async resetPassword(email: string, code: string, newPassword: string): Promise<boolean> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    if (!user.passwordResetCode || !user.passwordResetCodeExpires) {
      throw new UnauthorizedException('Código de recuperación no encontrado');
    }

    if (new Date() > user.passwordResetCodeExpires) {
      throw new UnauthorizedException('El código de recuperación ha expirado');
    }

    if (user.passwordResetCode !== code) {
      throw new UnauthorizedException('Código de recuperación incorrecto');
    }

    // Validar nueva contraseña
    if (newPassword.length < 6) {
      throw new UnauthorizedException('La contraseña debe tener al menos 6 caracteres');
    }

    // Hash de la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar contraseña y limpiar código de reset
    await this.usersService.update(user.id, {
      password: hashedPassword,
      passwordResetCode: null,
      passwordResetCodeExpires: null,
    });

    return true;
  }
}

