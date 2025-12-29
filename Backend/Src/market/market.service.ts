import { Injectable } from '@nestjs/common';
import { PrismaService } from '../Prisma/prisma.service';

@Injectable()
export class MarketService {
  constructor(private prisma: PrismaService) {}

  async getProductsByCategory(categoryId: string) {
    // Buscar productos del restaurante "market" con la categoría específica
    const products = await this.prisma.product.findMany({
      where: {
        restaurantId: 'market',
        category: {
          equals: categoryId,
          mode: 'insensitive',
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    // Si no hay productos en la BD, retornar array vacío (el frontend usará mock data)
    return products.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category,
      brand: null,
      stock: null,
    }));
  }

  async getProductById(categoryId: string, productId: string) {
    const product = await this.prisma.product.findFirst({
      where: {
        id: productId,
        restaurantId: 'market',
        category: {
          equals: categoryId,
          mode: 'insensitive',
        },
      },
    });

    if (!product) {
      return null;
    }

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category,
      brand: null,
      stock: null,
    };
  }

  async getAllCategories() {
    // Obtener todas las categorías únicas de productos del mercado
    const products = await this.prisma.product.findMany({
      where: {
        restaurantId: 'market',
      },
      select: {
        category: true,
      },
      distinct: ['category'],
    });

    return products
      .map((p) => p.category)
      .filter((cat): cat is string => cat !== null);
  }
}

