import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../Prisma/prisma.service';

@Injectable()
export class CouponsService {
  constructor(private prisma: PrismaService) {}

  async validateCoupon(code: string, userId: string, orderTotal: number, restaurantId?: string) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
      include: {
        usages: {
          where: { userId },
        },
      },
    });

    if (!coupon) {
      throw new NotFoundException('Código de cupón no encontrado');
    }

    if (!coupon.isActive) {
      throw new BadRequestException('Este cupón no está activo');
    }

    const now = new Date();
    if (coupon.startDate && now < coupon.startDate) {
      throw new BadRequestException('Este cupón aún no está disponible');
    }

    if (coupon.endDate && now > coupon.endDate) {
      throw new BadRequestException('Este cupón ha expirado');
    }

    if (coupon.restaurantId && coupon.restaurantId !== restaurantId) {
      throw new BadRequestException('Este cupón no es válido para este restaurante');
    }

    if (coupon.minOrder && orderTotal < coupon.minOrder) {
      throw new BadRequestException(`El pedido mínimo para este cupón es $${coupon.minOrder}`);
    }

    // Verificar límite de usos totales
    if (coupon.usageLimit) {
      const totalUsages = await this.prisma.userCoupon.count({
        where: {
          couponId: coupon.id,
          usedAt: { not: null },
        },
      });

      if (totalUsages >= coupon.usageLimit) {
        throw new BadRequestException('Este cupón ha alcanzado su límite de usos');
      }
    }

    // Verificar límite de usos por usuario
    if (coupon.userUsageLimit) {
      const userUsages = coupon.usages.filter(u => u.usedAt !== null).length;
      if (userUsages >= coupon.userUsageLimit) {
        throw new BadRequestException('Has alcanzado el límite de usos para este cupón');
      }
    }

    // Calcular descuento
    let discount = 0;
    if (coupon.type === 'percentage' && coupon.discount) {
      discount = (orderTotal * coupon.discount) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else if (coupon.type === 'fixed' && coupon.discountAmount) {
      discount = coupon.discountAmount;
    } else if (coupon.type === 'free_delivery') {
      // El descuento del envío se calcula en el servicio de órdenes
      discount = 2.99; // Fee de envío estándar
    }

    return {
      coupon: {
        id: coupon.id,
        code: coupon.code,
        description: coupon.description,
        type: coupon.type,
      },
      discount: Math.round(discount * 100) / 100,
    };
  }

  async applyCoupon(userId: string, couponId: string, orderId: string) {
    // Registrar el uso del cupón
    await this.prisma.userCoupon.upsert({
      where: {
        userId_couponId: {
          userId,
          couponId,
        },
      },
      create: {
        userId,
        couponId,
        usedAt: new Date(),
      },
      update: {
        usedAt: new Date(),
      },
    });

    return { message: 'Cupón aplicado correctamente' };
  }

  async getAvailableCoupons(userId?: string) {
    const now = new Date();
    const coupons = await this.prisma.coupon.findMany({
      where: {
        isActive: true,
        OR: [
          { startDate: null },
          { startDate: { lte: now } },
        ],
        AND: [
          {
            OR: [
              { endDate: null },
              { endDate: { gte: now } },
            ],
          },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });

    // Si hay userId, verificar cuáles puede usar
    if (userId) {
      const userCoupons = await this.prisma.userCoupon.findMany({
        where: { userId },
      });

      return coupons.map(coupon => {
        const userCoupon = userCoupons.find(uc => uc.couponId === coupon.id);
        const canUse = !userCoupon?.usedAt || 
                      (coupon.userUsageLimit && 
                       userCoupons.filter(uc => uc.couponId === coupon.id && uc.usedAt).length < coupon.userUsageLimit);

        return {
          ...coupon,
          canUse,
        };
      });
    }

    return coupons;
  }
}

