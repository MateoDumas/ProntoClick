import { Controller, Get, Param, Query, Request, UseGuards } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { JwtAuthGuard } from '../common/jwt.guard';

@Controller('promotions')
export class PromotionsController {
  constructor(private promotionsService: PromotionsService) {}

  @Get()
  async getActivePromotions(@Query('restaurantId') restaurantId?: string, @Request() req?: any) {
    const userId = req?.user?.id;
    return this.promotionsService.getActivePromotions(restaurantId, userId);
  }

  @Get('featured')
  async getFeaturedPromotions(@Query('limit') limit?: string, @Request() req?: any) {
    const limitNum = limit ? parseInt(limit) : 3;
    const userId = req?.user?.id;
    return this.promotionsService.getFeaturedPromotions(limitNum, userId);
  }

  @Get('code/:code')
  async getPromotionByCode(@Param('code') code: string) {
    return this.promotionsService.getPromotionByCode(code);
  }
}

