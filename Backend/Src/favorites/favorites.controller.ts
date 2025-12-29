import { Controller, Get, Post, Delete, Param, UseGuards, Request } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../common/jwt.guard';

@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(private favoritesService: FavoritesService) {}

  @Get()
  async getUserFavorites(@Request() req) {
    return this.favoritesService.getUserFavorites(req.user.id);
  }

  @Post(':type/:id')
  async addFavorite(
    @Request() req,
    @Param('type') type: 'restaurant' | 'product',
    @Param('id') id: string,
  ) {
    return this.favoritesService.addFavorite(req.user.id, type, id);
  }

  @Delete(':type/:id')
  async removeFavorite(
    @Request() req,
    @Param('type') type: 'restaurant' | 'product',
    @Param('id') id: string,
  ) {
    return this.favoritesService.removeFavorite(req.user.id, type, id);
  }

  @Get('check/:type/:id')
  async checkFavorite(
    @Request() req,
    @Param('type') type: 'restaurant' | 'product',
    @Param('id') id: string,
  ) {
    const isFavorite = await this.favoritesService.isFavorite(req.user.id, type, id);
    return { isFavorite };
  }
}

