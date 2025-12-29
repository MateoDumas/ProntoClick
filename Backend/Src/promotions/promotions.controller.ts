import { Controller, Get, Param, Query } from '@nestjs/common';
import { PromotionsService } from './promotions.service';

@Controller('promotions')
export class PromotionsController {
  constructor(private promotionsService: PromotionsService) {}

  @Get()
  async getActivePromotions(@Query('restaurantId') restaurantId?: string) {
    return this.promotionsService.getActivePromotions(restaurantId);
  }

  @Get('featured')
  async getFeaturedPromotions(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit) : 3;
    return this.promotionsService.getFeaturedPromotions(limitNum);
  }

  @Get('code/:code')
  async getPromotionByCode(@Param('code') code: string) {
    return this.promotionsService.getPromotionByCode(code);
  }
}

