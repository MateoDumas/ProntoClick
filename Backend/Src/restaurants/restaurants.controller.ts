import { Controller, Get, Param, UseGuards, Request, Query } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { JwtAuthGuard } from '../common/jwt.guard';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private restaurantsService: RestaurantsService) {}

  @Get()
  async findAll() {
    return this.restaurantsService.findAll();
  }

  @Get('favorites')
  @UseGuards(JwtAuthGuard)
  async getMostOrdered(@Request() req, @Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit) : 6;
    return this.restaurantsService.getMostOrderedByUser(req.user.id, limitNum);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.restaurantsService.findOne(id);
  }

  @Get(':id/products')
  async getProducts(@Param('id') id: string) {
    return this.restaurantsService.getProducts(id);
  }
}

