import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from '../common/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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
}

