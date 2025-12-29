import { Controller, Get, Post, Param, UseGuards, Request } from '@nestjs/common';
import { RewardsService } from './rewards.service';
import { JwtAuthGuard } from '../common/jwt.guard';

@Controller('rewards')
export class RewardsController {
  constructor(private rewardsService: RewardsService) {}

  @Get('points')
  @UseGuards(JwtAuthGuard)
  async getUserPoints(@Request() req) {
    return this.rewardsService.getUserPoints(req.user.id);
  }

  @Get('history')
  @UseGuards(JwtAuthGuard)
  async getPointHistory(@Request() req) {
    return this.rewardsService.getPointHistory(req.user.id);
  }

  @Get('available')
  async getAvailableRewards() {
    return this.rewardsService.getAvailableRewards();
  }

  @Post('redeem/:rewardId')
  @UseGuards(JwtAuthGuard)
  async redeemReward(@Request() req, @Param('rewardId') rewardId: string) {
    return this.rewardsService.redeemReward(req.user.id, rewardId);
  }

  @Get('my-rewards')
  @UseGuards(JwtAuthGuard)
  async getUserRewards(@Request() req) {
    return this.rewardsService.getUserRewards(req.user.id);
  }
}

