import { Injectable } from '@nestjs/common';
import { PrismaService } from '../Prisma/prisma.service';

@Injectable()
export class RecommendationsService {
  constructor(private prisma: PrismaService) {}

  async getRecommendations(userId: string, limit: number = 10) {
    // Obtener historial de pedidos del usuario
    const userOrders = await this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                restaurant: true,
              },
            },
          },
        },
        restaurant: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 20, // Últimos 20 pedidos
    });

    // Extraer categorías y restaurantes favoritos
    const favoriteCategories = new Map<string, number>();
    const favoriteRestaurants = new Map<string, number>();

    userOrders.forEach(order => {
      // Contar restaurantes
      const restaurantId = order.restaurantId;
      favoriteRestaurants.set(
        restaurantId,
        (favoriteRestaurants.get(restaurantId) || 0) + 1
      );

      // Contar categorías de productos
      order.items.forEach(item => {
        if (item.product.category) {
          favoriteCategories.set(
            item.product.category,
            (favoriteCategories.get(item.product.category) || 0) + item.quantity
          );
        }
      });
    });

    // Obtener restaurantes recomendados (basados en favoritos y rating)
    const topRestaurantIds = Array.from(favoriteRestaurants.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([id]) => id);

    const recommendedRestaurants = await this.prisma.restaurant.findMany({
      where: {
        OR: [
          { id: { in: topRestaurantIds } },
          { rating: { gte: 4.5 } },
        ],
        id: { notIn: topRestaurantIds }, // Excluir los que ya están en favoritos
      },
      orderBy: { rating: 'desc' },
      take: limit,
    });

    // Obtener productos recomendados (basados en categorías favoritas)
    const topCategories = Array.from(favoriteCategories.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([category]) => category);

    const recommendedProducts = await this.prisma.product.findMany({
      where: {
        category: { in: topCategories },
        restaurantId: { not: 'market' },
      },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: [
        { restaurant: { rating: 'desc' } },
      ],
      take: limit,
    });

    return {
      restaurants: recommendedRestaurants,
      products: recommendedProducts,
      favoriteCategories: topCategories,
      favoriteRestaurants: topRestaurantIds,
    };
  }

  async getTrending(limit: number = 10) {
    // Restaurantes más pedidos en los últimos 30 días
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentOrders = await this.prisma.order.findMany({
      where: {
        createdAt: { gte: thirtyDaysAgo },
      },
      select: {
        restaurantId: true,
      },
    });

    const restaurantCounts = new Map<string, number>();
    recentOrders.forEach(order => {
      restaurantCounts.set(
        order.restaurantId,
        (restaurantCounts.get(order.restaurantId) || 0) + 1
      );
    });

    const topRestaurantIds = Array.from(restaurantCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([id]) => id);

    const trendingRestaurants = await this.prisma.restaurant.findMany({
      where: {
        id: { in: topRestaurantIds },
      },
      orderBy: {
        rating: 'desc',
      },
    });

    // Ordenar por cantidad de pedidos
    return trendingRestaurants.sort((a, b) => {
      const countA = restaurantCounts.get(a.id) || 0;
      const countB = restaurantCounts.get(b.id) || 0;
      return countB - countA;
    });
  }
}

