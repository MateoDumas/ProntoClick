import { Controller, Get, Post, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { JwtAuthGuard } from '../common/jwt.guard';

@Controller('coupons')
export class CouponsController {
  constructor(private couponsService: CouponsService) {}

  @Get()
  async getAvailableCoupons(@Request() req) {
    const userId = req.user?.id;
    return this.couponsService.getAvailableCoupons(userId);
  }

  @Post('validate')
  @UseGuards(JwtAuthGuard)
  async validateCoupon(
    @Request() req,
    @Body() body: {
      code: string;
      orderTotal: number;
      restaurantId?: string;
    },
  ) {
    return this.couponsService.validateCoupon(
      body.code,
      req.user.id,
      body.orderTotal,
      body.restaurantId,
    );
  }

  @Post(':couponId/apply')
  @UseGuards(JwtAuthGuard)
  async applyCoupon(
    @Request() req,
    @Param('couponId') couponId: string,
    @Body() body: { orderId: string },
  ) {
    return this.couponsService.applyCoupon(req.user.id, couponId, body.orderId);
  }
}

