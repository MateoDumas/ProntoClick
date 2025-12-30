import { Injectable } from '@nestjs/common';
import { PrismaService } from '../Prisma/prisma.service';

@Injectable()
export class PromotionsService {
  constructor(private prisma: PrismaService) {}

  async getActivePromotions(restaurantId?: string, userId?: string) {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = domingo, 6 = sábado

    const where: any = {
      isActive: true,
      OR: [
        { dayOfWeek: null }, // Promociones que aplican todos los días
        { dayOfWeek }, // Promociones específicas del día actual
      ],
      AND: [
        {
          OR: [
            { startDate: null },
            { startDate: { lte: today } },
          ],
        },
        {
          OR: [
            { endDate: null },
            { endDate: { gte: today } },
          ],
        },
      ],
    };

    if (restaurantId) {
      where.OR = [
        { restaurantId: null }, // Promociones generales
        { restaurantId }, // Promociones del restaurante específico
      ];
    } else {
      where.restaurantId = null; // Solo promociones generales si no se especifica restaurante
    }

    let promotions = await this.prisma.promotion.findMany({
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
      orderBy: [
        { discount: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    // Si hay userId, filtrar el descuento de bienvenida si el usuario ya hizo pedidos
    if (userId) {
      const userOrdersCount = await this.prisma.order.count({
        where: {
          userId,
          status: { not: 'cancelled' },
        },
      });

      // Si el usuario ya hizo al menos un pedido, filtrar promociones de bienvenida
      if (userOrdersCount > 0) {
        promotions = promotions.filter(
          (promo) => 
            !promo.code?.toUpperCase().includes('BIENVENIDO') && 
            !promo.code?.toUpperCase().includes('BIENVENIDA') &&
            !promo.title.toLowerCase().includes('bienvenida') &&
            !promo.title.toLowerCase().includes('primera compra')
        );
      }
    }

    return promotions;
  }

  async getFeaturedPromotions(limit: number = 3, userId?: string) {
    const promotions = await this.getActivePromotions(undefined, userId);
    
    // Rotar promociones basándose en el día de la semana
    const dayOfWeek = new Date().getDay();
    const startIndex = (dayOfWeek * 2) % promotions.length; // Cambia cada día
    
    return promotions.slice(startIndex, startIndex + limit);
  }

  async getPromotionByCode(code: string) {
    const today = new Date();
    const dayOfWeek = today.getDay();

    return this.prisma.promotion.findFirst({
      where: {
        code: code.toUpperCase(),
        isActive: true,
        OR: [
          { dayOfWeek: null },
          { dayOfWeek },
        ],
        AND: [
          {
            OR: [
              { startDate: null },
              { startDate: { lte: today } },
            ],
          },
          {
            OR: [
              { endDate: null },
              { endDate: { gte: today } },
            ],
          },
        ],
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
    });
  }
}

