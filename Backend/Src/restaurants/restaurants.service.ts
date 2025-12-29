import { Injectable } from '@nestjs/common';
import { PrismaService } from '../Prisma/prisma.service';
import { Restaurant, Product } from '@prisma/client';

@Injectable()
export class RestaurantsService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Restaurant[]> {
    return this.prisma.restaurant.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string): Promise<Restaurant | null> {
    return this.prisma.restaurant.findUnique({
      where: { id },
    });
  }

  async getProducts(restaurantId: string): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: { restaurantId },
      orderBy: { category: 'asc' },
    });
  }

  /**
   * Obtiene los restaurantes más pedidos por un usuario
   * Solo incluye restaurantes con al menos 2 pedidos
   */
  async getMostOrderedByUser(userId: string, limit: number = 6): Promise<Restaurant[]> {
    // Obtener restaurantes con al menos 2 pedidos del usuario
    const restaurantOrders = await this.prisma.order.groupBy({
      by: ['restaurantId'],
      where: {
        userId,
        status: {
          not: 'cancelled',
        },
      },
      _count: {
        id: true,
      },
      having: {
        id: {
          _count: {
            gte: 2, // Al menos 2 pedidos
          },
        },
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: limit,
    });

    // Obtener los IDs de los restaurantes
    const restaurantIds = restaurantOrders.map((ro) => ro.restaurantId);

    if (restaurantIds.length === 0) {
      return [];
    }

    // Obtener los restaurantes con sus datos completos
    const restaurants = await this.prisma.restaurant.findMany({
      where: {
        id: {
          in: restaurantIds,
        },
      },
    });

    // Ordenar según el número de pedidos (mayor a menor)
    const orderCountMap = new Map(
      restaurantOrders.map((ro) => [ro.restaurantId, ro._count.id]),
    );

    return restaurants.sort((a, b) => {
      const countA = orderCountMap.get(a.id) || 0;
      const countB = orderCountMap.get(b.id) || 0;
      return countB - countA;
    });
  }
}

