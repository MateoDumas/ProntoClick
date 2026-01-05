import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TwoFactorService } from './two-factor.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from '../common/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private twoFactorService: TwoFactorService,
  ) {}

  @Post('register')
  async register(@Body() body: { email: string; password: string; name: string; referralCode?: string }) {
    return this.authService.register(body);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.connection?.remoteAddress;
    const userAgent = req.headers['user-agent'] || 'Unknown device';
    return this.authService.login(req.user, ipAddress, userAgent);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('verify-email')
  async verifyEmail(@Request() req, @Body() body: { code: string }) {
    const success = await this.authService.verifyEmail(req.user.id, body.code);
    return { success, message: 'Email verificado correctamente' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('resend-verification')
  async resendVerification(@Request() req) {
    const success = await this.authService.resendVerificationCode(req.user.id);
    return { success, message: 'Código de verificación reenviado' };
  }

  // ========== 2FA Endpoints ==========

  @Post('verify-two-factor')
  async verifyTwoFactorAndLogin(@Request() req, @Body() body: { userId: string; code: string }) {
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.connection?.remoteAddress;
    const userAgent = req.headers['user-agent'] || 'Unknown device';
    return await this.authService.verifyTwoFactorAndLogin(body.userId, body.code, ipAddress, userAgent);
  }

  @UseGuards(JwtAuthGuard)
  @Post('two-factor/generate')
  async generateTwoFactorSecret(@Request() req) {
    const result = await this.twoFactorService.generateSecret(req.user.id);
    return {
      success: true,
      ...result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('two-factor/verify-and-enable')
  async verifyAndEnableTwoFactor(@Request() req, @Body() body: { code: string }) {
    const success = await this.twoFactorService.verifyAndEnable(req.user.id, body.code);
    return {
      success,
      message: '2FA activado correctamente',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('two-factor/disable')
  async disableTwoFactor(@Request() req) {
    const success = await this.twoFactorService.disable(req.user.id);
    return {
      success,
      message: '2FA desactivado correctamente',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('two-factor/regenerate-backup-codes')
  async regenerateBackupCodes(@Request() req) {
    const backupCodes = await this.twoFactorService.regenerateBackupCodes(req.user.id);
    return {
      success: true,
      backupCodes,
      message: 'Códigos de respaldo regenerados',
    };
  }

  // ========== Password Reset Endpoints ==========

  @Post('forgot-password')
  async requestPasswordReset(@Body() body: { email: string }) {
    const result = await this.authService.requestPasswordReset(body.email);
    return {
      success: true,
      ...result,
    };
  }

  @Post('forgot-password/method')
  async requestPasswordResetByMethod(@Body() body: { email: string; method: string }) {
    await this.authService.requestPasswordResetByMethod(body.email, body.method);
    return {
      success: true,
      message: 'Código de recuperación enviado',
    };
  }

  @Post('forgot-password/get-security-question')
  async getSecurityQuestion(@Body() body: { email: string }) {
    const question = await this.authService.getSecurityQuestion(body.email);
    return {
      success: true,
      question,
    };
  }

  @Post('forgot-password/verify-security-question')
  async verifySecurityQuestion(@Body() body: { email: string; answer: string }) {
    await this.authService.verifySecurityQuestion(body.email, body.answer);
    return {
      success: true,
      message: 'Pregunta de seguridad verificada. Código de recuperación enviado por email',
    };
  }

  @Post('reset-password')
  async resetPassword(@Body() body: { email: string; code: string; newPassword: string }) {
    await this.authService.resetPassword(body.email, body.code, body.newPassword);
    return {
      success: true,
      message: 'Contraseña restablecida correctamente',
    };
  }
}

