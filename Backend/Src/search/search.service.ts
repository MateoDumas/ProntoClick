import { Injectable } from '@nestjs/common';
import { PrismaService } from '../Prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async searchAll(query: string) {
    const searchTerm = query.toLowerCase().trim();

    if (!searchTerm) {
      return {
        restaurants: [],
        products: [],
        total: 0,
      };
    }

    // Búsqueda de productos (PRIORIDAD) - más relevante para usuarios
    // Buscar en nombre, descripción y categoría
    const products = await this.prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } },
          { category: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            image: true,
            rating: true,
          },
        },
      },
      take: 15, // Más productos que restaurantes
    });

    // Ordenar productos por relevancia:
    // 1. Los que empiezan con el término de búsqueda
    // 2. Los que tienen el término en el nombre
    // 3. Los que tienen el término en la descripción
    const sortedProducts = products.sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      
      // Priorizar los que empiezan con el término
      const aStarts = aName.startsWith(searchTerm) ? 1 : 0;
      const bStarts = bName.startsWith(searchTerm) ? 1 : 0;
      if (aStarts !== bStarts) return bStarts - aStarts;
      
      // Luego los que tienen el término en el nombre
      const aNameMatch = aName.includes(searchTerm) ? 1 : 0;
      const bNameMatch = bName.includes(searchTerm) ? 1 : 0;
      if (aNameMatch !== bNameMatch) return bNameMatch - aNameMatch;
      
      // Finalmente ordenar alfabéticamente
      return aName.localeCompare(bName);
    });

    // Búsqueda de restaurantes (secundaria) - solo si el término podría ser un nombre de restaurante
    // Buscar restaurantes que tengan productos relacionados con la búsqueda
    const restaurants = await this.prisma.restaurant.findMany({
      where: {
        OR: [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } },
          // También buscar restaurantes que tengan productos relacionados
          {
            products: {
              some: {
                OR: [
                  { name: { contains: searchTerm, mode: 'insensitive' } },
                  { category: { contains: searchTerm, mode: 'insensitive' } },
                ],
              },
            },
          },
        ],
      },
      take: 5, // Menos restaurantes, más productos
      orderBy: { rating: 'desc' },
    });

    return {
      restaurants,
      products: sortedProducts,
      total: restaurants.length + sortedProducts.length,
    };
  }

  async searchRestaurants(query: string, filters?: {
    minRating?: number;
    maxDeliveryTime?: number;
    minOrder?: number;
  }) {
    const searchTerm = query.toLowerCase().trim();

    const where: any = {};

    if (searchTerm) {
      where.OR = [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } },
      ];
    }

    if (filters?.minRating) {
      where.rating = { gte: filters.minRating };
    }

    if (filters?.maxDeliveryTime) {
      // Extraer el número máximo del tiempo de entrega (ej: "25-35 min" -> 35)
      where.deliveryTime = {
        contains: filters.maxDeliveryTime.toString(),
      };
    }

    if (filters?.minOrder) {
      where.minOrder = { lte: filters.minOrder };
    }

    return this.prisma.restaurant.findMany({
      where,
      orderBy: [
        { rating: 'desc' },
        { name: 'asc' },
      ],
    });
  }

  async searchProducts(query: string, restaurantId?: string) {
    const searchTerm = query.toLowerCase().trim();

    const where: any = {};

    if (searchTerm) {
      where.OR = [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } },
        { category: { contains: searchTerm, mode: 'insensitive' } },
      ];
    }

    if (restaurantId) {
      where.restaurantId = restaurantId;
    }

    return this.prisma.product.findMany({
      where,
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  }
}

