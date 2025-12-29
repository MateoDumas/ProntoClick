import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SearchService } from './search.service';
import { JwtAuthGuard } from '../common/jwt.guard';

@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get()
  async searchAll(@Query('q') query: string) {
    return this.searchService.searchAll(query || '');
  }

  @Get('restaurants')
  async searchRestaurants(
    @Query('q') query: string,
    @Query('minRating') minRating?: string,
    @Query('maxDeliveryTime') maxDeliveryTime?: string,
    @Query('minOrder') minOrder?: string,
  ) {
    const filters: any = {};
    if (minRating) filters.minRating = parseFloat(minRating);
    if (maxDeliveryTime) filters.maxDeliveryTime = parseInt(maxDeliveryTime);
    if (minOrder) filters.minOrder = parseFloat(minOrder);

    return this.searchService.searchRestaurants(query || '', filters);
  }

  @Get('products')
  async searchProducts(
    @Query('q') query: string,
    @Query('restaurantId') restaurantId?: string,
  ) {
    return this.searchService.searchProducts(query || '', restaurantId);
  }
}

