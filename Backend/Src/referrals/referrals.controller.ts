import { Controller, Get, Post, Body, UseGuards, Request, Param } from '@nestjs/common';
import { ReferralsService } from './referrals.service';
import { JwtAuthGuard } from '../common/jwt.guard';

@Controller('referrals')
export class ReferralsController {
  constructor(private referralsService: ReferralsService) {}

  @Get('code')
  @UseGuards(JwtAuthGuard)
  async getReferralCode(@Request() req) {
    const code = await this.referralsService.getReferralCode(req.user.id);
    return { code };
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  async getStats(@Request() req) {
    return this.referralsService.getReferralStats(req.user.id);
  }

  @Post('validate')
  async validateCode(@Body() body: { code: string }) {
    return this.referralsService.validateReferralCode(body.code);
  }
}

