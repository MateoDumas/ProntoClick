import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../Prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async addFavorite(userId: string, type: 'restaurant' | 'product', id: string) {
    if (type === 'restaurant') {
      // Verificar que el restaurante existe
      const restaurant = await this.prisma.restaurant.findUnique({
        where: { id },
      });
      if (!restaurant) {
        throw new NotFoundException('Restaurante no encontrado');
      }

      // Verificar si ya es favorito
      const existing = await this.prisma.favorite.findFirst({
        where: {
          userId,
          restaurantId: id,
        },
      });

      if (existing) {
        return existing;
      }

      return this.prisma.favorite.create({
        data: {
          userId,
          restaurantId: id,
          type: 'restaurant',
        },
        include: {
          restaurant: true,
        },
      });
    } else if (type === 'product') {
      // Verificar que el producto existe
      const product = await this.prisma.product.findUnique({
        where: { id },
      });
      if (!product) {
        throw new NotFoundException('Producto no encontrado');
      }

      // Verificar si ya es favorito
      const existing = await this.prisma.favorite.findFirst({
        where: {
          userId,
          productId: id,
        },
      });

      if (existing) {
        return existing;
      }

      return this.prisma.favorite.create({
        data: {
          userId,
          productId: id,
          type: 'product',
        },
        include: {
          product: {
            include: {
              restaurant: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
          },
        },
      });
    }

    throw new BadRequestException('Tipo de favorito inválido');
  }

  async removeFavorite(userId: string, type: 'restaurant' | 'product', id: string) {
    if (type === 'restaurant') {
      const favorite = await this.prisma.favorite.findFirst({
        where: {
          userId,
          restaurantId: id,
        },
      });

      if (!favorite) {
        throw new NotFoundException('Favorito no encontrado');
      }

      await this.prisma.favorite.delete({
        where: { id: favorite.id },
      });

      return { success: true };
    } else if (type === 'product') {
      const favorite = await this.prisma.favorite.findFirst({
        where: {
          userId,
          productId: id,
        },
      });

      if (!favorite) {
        throw new NotFoundException('Favorito no encontrado');
      }

      await this.prisma.favorite.delete({
        where: { id: favorite.id },
      });

      return { success: true };
    }

    throw new BadRequestException('Tipo de favorito inválido');
  }

  async getUserFavorites(userId: string) {
    const favorites = await this.prisma.favorite.findMany({
      where: { userId },
      include: {
        restaurant: true,
        product: {
          include: {
            restaurant: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      restaurants: favorites
        .filter((f) => f.type === 'restaurant' && f.restaurant)
        .map((f) => f.restaurant),
      products: favorites
        .filter((f) => f.type === 'product' && f.product)
        .map((f) => f.product),
    };
  }

  async isFavorite(userId: string, type: 'restaurant' | 'product', id: string): Promise<boolean> {
    if (type === 'restaurant') {
      const favorite = await this.prisma.favorite.findFirst({
        where: {
          userId,
          restaurantId: id,
        },
      });
      return !!favorite;
    } else {
      const favorite = await this.prisma.favorite.findFirst({
        where: {
          userId,
          productId: id,
        },
      });
      return !!favorite;
    }
  }
}

