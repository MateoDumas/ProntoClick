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
    return this.authService.login(req.user);
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
  async verifyTwoFactorAndLogin(@Body() body: { userId: string; code: string }) {
    return await this.authService.verifyTwoFactorAndLogin(body.userId, body.code);
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
}

