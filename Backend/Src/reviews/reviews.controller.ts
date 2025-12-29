import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../common/jwt.guard';

@Controller('reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Request() req, @Body() body: {
    restaurantId?: string;
    productId?: string;
    orderId?: string;
    rating: number;
    comment?: string;
  }) {
    return this.reviewsService.create(req.user.id, body);
  }

  @Get('restaurant/:restaurantId')
  async getByRestaurant(@Param('restaurantId') restaurantId: string) {
    return this.reviewsService.getByRestaurant(restaurantId);
  }

  @Get('product/:productId')
  async getByProduct(@Param('productId') productId: string) {
    return this.reviewsService.getByProduct(productId);
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  async getUserReview(
    @Request() req,
    @Query('restaurantId') restaurantId?: string,
    @Query('productId') productId?: string,
    @Query('orderId') orderId?: string,
  ) {
    return this.reviewsService.getUserReview(
      req.user.id,
      restaurantId || undefined,
      productId || undefined,
      orderId || undefined,
    );
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() body: { rating?: number; comment?: string },
  ) {
    return this.reviewsService.update(req.user.id, id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Request() req, @Param('id') id: string) {
    await this.reviewsService.delete(req.user.id, id);
    return { message: 'Reseña eliminada correctamente' };
  }
}

