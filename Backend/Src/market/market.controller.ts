import { Controller, Get, Param } from '@nestjs/common';
import { MarketService } from './market.service';

@Controller('market')
export class MarketController {
  constructor(private marketService: MarketService) {}

  @Get(':categoryId/products')
  async getProductsByCategory(@Param('categoryId') categoryId: string) {
    return this.marketService.getProductsByCategory(categoryId);
  }

  @Get(':categoryId/products/:productId')
  async getProductById(
    @Param('categoryId') categoryId: string,
    @Param('productId') productId: string,
  ) {
    const product = await this.marketService.getProductById(categoryId, productId);
    if (!product) {
      return { error: 'Producto no encontrado' };
    }
    return product;
  }

  @Get('categories')
  async getAllCategories() {
    return this.marketService.getAllCategories();
  }
}

