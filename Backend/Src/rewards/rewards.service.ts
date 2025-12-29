import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../Prisma/prisma.service';

@Injectable()
export class RewardsService {
  constructor(private prisma: PrismaService) {}

  async getUserPoints(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { points: true },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return {
      points: user.points,
    };
  }

  async getPointHistory(userId: string) {
    const transactions = await this.prisma.pointTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return transactions;
  }

  async getAvailableRewards() {
    return this.prisma.reward.findMany({
      where: { isActive: true },
      orderBy: { pointsCost: 'asc' },
      include: {
        _count: {
          select: { redemptions: true },
        },
      },
    });
  }

  async redeemReward(userId: string, rewardId: string) {
    // Obtener usuario y recompensa
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const reward = await this.prisma.reward.findUnique({
      where: { id: rewardId },
    });

    if (!reward) {
      throw new NotFoundException('Recompensa no encontrada');
    }

    if (!reward.isActive) {
      throw new BadRequestException('Esta recompensa no está disponible');
    }

    // Verificar stock
    if (reward.stock !== null && reward.redeemedCount >= reward.stock) {
      throw new BadRequestException('Esta recompensa se ha agotado');
    }

    // Verificar puntos suficientes
    if (user.points < reward.pointsCost) {
      throw new BadRequestException(
        `No tienes suficientes puntos. Necesitas ${reward.pointsCost} puntos y tienes ${user.points}`
      );
    }

    // Generar código de cupón si es necesario
    let couponCode: string | null = null;
    if (reward.type === 'coupon' || reward.type === 'discount' || reward.type === 'free_delivery') {
      couponCode = `PRONTO${Date.now().toString(36).toUpperCase()}`;
    }

    // Usar transacción para asegurar consistencia
    const result = await this.prisma.$transaction(async (tx) => {
      // Descontar puntos del usuario
      await tx.user.update({
        where: { id: userId },
        data: {
          points: {
            decrement: reward.pointsCost,
          },
        },
      });

      // Registrar transacción de puntos
      await tx.pointTransaction.create({
        data: {
          userId,
          points: -reward.pointsCost,
          type: 'reward_redemption',
          description: `Canje de recompensa: ${reward.title}`,
          rewardId: reward.id,
        },
      });

      // Crear registro de recompensa canjeada
      const userReward = await tx.userReward.create({
        data: {
          userId,
          rewardId: reward.id,
          couponCode,
        },
      });

      // Actualizar contador de canjes
      await tx.reward.update({
        where: { id: rewardId },
        data: {
          redeemedCount: {
            increment: 1,
          },
        },
      });

      // Si es un cupón, crear el cupón en la tabla de cupones
      if (couponCode && (reward.type === 'coupon' || reward.type === 'discount' || reward.type === 'free_delivery')) {
        let couponType = 'percentage';
        if (reward.type === 'discount') {
          couponType = 'fixed';
        } else if (reward.type === 'free_delivery') {
          couponType = 'free_delivery';
        }

        await tx.coupon.create({
          data: {
            code: couponCode,
            description: reward.description,
            discount: reward.discount || undefined,
            discountAmount: reward.discountAmount || undefined,
            type: couponType as any,
            minOrder: 0,
            isActive: true,
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Válido por 30 días
          },
        });
      }

      return userReward;
    });

    return {
      success: true,
      reward: {
        id: reward.id,
        title: reward.title,
        description: reward.description,
        couponCode,
      },
      remainingPoints: user.points - reward.pointsCost,
    };
  }

  async addPoints(userId: string, points: number, type: string, description: string, orderId?: string) {
    await this.prisma.$transaction(async (tx) => {
      // Agregar puntos al usuario
      await tx.user.update({
        where: { id: userId },
        data: {
          points: {
            increment: points,
          },
        },
      });

      // Registrar transacción
      await tx.pointTransaction.create({
        data: {
          userId,
          points,
          type,
          description,
          orderId: orderId || undefined,
        },
      });
    });

    return { pointsAdded: points };
  }

  async addPointsFromOrder(userId: string, orderId: string, orderTotal: number) {
    // Calcular puntos: 1 punto por cada dólar gastado (redondeado)
    const pointsEarned = Math.floor(orderTotal);

    await this.addPoints(
      userId,
      pointsEarned,
      'purchase',
      `Puntos ganados por compra de $${orderTotal.toFixed(2)}`,
      orderId,
    );

    return { pointsEarned };
  }

  async getUserRewards(userId: string) {
    return this.prisma.userReward.findMany({
      where: { userId },
      include: {
        reward: true,
      },
      orderBy: { redeemedAt: 'desc' },
    });
  }
}

