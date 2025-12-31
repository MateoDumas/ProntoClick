import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';
import { UsersService } from '../users/users.service';

@Injectable()
export class TwoFactorService {
  constructor(private usersService: UsersService) {}

  /**
   * Genera un secret para 2FA y un QR code
   */
  async generateSecret(userId: string): Promise<{ secret: string; qrCodeUrl: string; backupCodes: string[] }> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    // Generar secret
    const secret = speakeasy.generateSecret({
      name: `ProntoClick (${user.email})`,
      issuer: 'ProntoClick',
      length: 32,
    });

    // Generar códigos de respaldo (10 códigos de 8 dígitos)
    const backupCodes = this.generateBackupCodes(10);

    // Generar QR code
    let qrCodeUrl: string;
    try {
      qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url!);
    } catch (error) {
      throw new BadRequestException('Error al generar el código QR');
    }

    // Guardar el secret temporalmente (no activar 2FA hasta que se verifique)
    await this.usersService.update(userId, {
      twoFactorSecret: secret.base32!,
      twoFactorBackupCodes: backupCodes,
    });

    return {
      secret: secret.base32!,
      qrCodeUrl,
      backupCodes,
    };
  }

  /**
   * Verifica un código TOTP y activa 2FA si es correcto
   */
  async verifyAndEnable(userId: string, code: string): Promise<boolean> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    if (!user.twoFactorSecret) {
      throw new BadRequestException('No se ha generado un secret para 2FA');
    }

    // Verificar código TOTP
    const isValid = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: code,
      window: 2, // Permitir códigos de ±2 períodos de tiempo (60 segundos cada uno)
    });

    if (!isValid) {
      throw new UnauthorizedException('Código de verificación incorrecto');
    }

    // Activar 2FA
    await this.usersService.update(userId, {
      twoFactorEnabled: true,
    });

    return true;
  }

  /**
   * Verifica un código TOTP durante el login
   */
  async verifyCode(userId: string, code: string): Promise<boolean> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    if (!user.twoFactorEnabled || !user.twoFactorSecret) {
      throw new BadRequestException('2FA no está activado para este usuario');
    }

    // Primero verificar si es un código de respaldo
    if (user.twoFactorBackupCodes && user.twoFactorBackupCodes.includes(code)) {
      // Eliminar el código de respaldo usado
      const updatedBackupCodes = user.twoFactorBackupCodes.filter((c) => c !== code);
      await this.usersService.update(userId, {
        twoFactorBackupCodes: updatedBackupCodes,
      });
      return true;
    }

    // Verificar código TOTP
    const isValid = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: code,
      window: 2,
    });

    if (!isValid) {
      throw new UnauthorizedException('Código de verificación incorrecto');
    }

    return true;
  }

  /**
   * Desactiva 2FA para un usuario
   */
  async disable(userId: string): Promise<boolean> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    await this.usersService.update(userId, {
      twoFactorEnabled: false,
      twoFactorSecret: null,
      twoFactorBackupCodes: [],
    });

    return true;
  }

  /**
   * Regenera códigos de respaldo
   */
  async regenerateBackupCodes(userId: string): Promise<string[]> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    if (!user.twoFactorEnabled) {
      throw new BadRequestException('2FA no está activado');
    }

    const backupCodes = this.generateBackupCodes(10);
    await this.usersService.update(userId, {
      twoFactorBackupCodes: backupCodes,
    });

    return backupCodes;
  }

  /**
   * Genera códigos de respaldo aleatorios
   */
  private generateBackupCodes(count: number): string[] {
    const codes: string[] = [];
    for (let i = 0; i < count; i++) {
      // Generar código de 8 dígitos
      const code = Math.floor(10000000 + Math.random() * 90000000).toString();
      codes.push(code);
    }
    return codes;
  }
}

