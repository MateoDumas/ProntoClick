import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../Prisma/prisma.service';
import { RewardsService } from '../rewards/rewards.service';

@Injectable()
export class ReferralsService {
  constructor(
    private prisma: PrismaService,
    private rewardsService: RewardsService,
  ) {}

  /**
   * Genera un código de referido único para un usuario
   */
  async generateReferralCode(userId: string): Promise<string> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Si ya tiene código, retornarlo
    if (user.referralCode) {
      return user.referralCode;
    }

    // Generar código único (6-8 caracteres alfanuméricos)
    let code: string;
    let exists = true;
    
    while (exists) {
      code = this.generateRandomCode();
      const existing = await this.prisma.user.findUnique({
        where: { referralCode: code },
      });
      exists = !!existing;
    }

    // Guardar código en el usuario
    await this.prisma.user.update({
      where: { id: userId },
      data: { referralCode: code },
    });

    return code;
  }

  /**
   * Obtiene el código de referido de un usuario
   */
  async getReferralCode(userId: string): Promise<string> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (!user.referralCode) {
      return await this.generateReferralCode(userId);
    }

    return user.referralCode;
  }

  /**
   * Valida un código de referido
   */
  async validateReferralCode(code: string): Promise<{ valid: boolean; referrerId?: string }> {
    const user = await this.prisma.user.findUnique({
      where: { referralCode: code },
    });

    if (!user) {
      return { valid: false };
    }

    return { valid: true, referrerId: user.id };
  }

  /**
   * Procesa un referido cuando un usuario se registra
   */
  async processReferral(referralCode: string, newUserId: string): Promise<void> {
    const validation = await this.validateReferralCode(referralCode);
    
    if (!validation.valid || !validation.referrerId) {
      throw new BadRequestException('Código de referido inválido');
    }

    // No permitir auto-referidos
    if (validation.referrerId === newUserId) {
      throw new BadRequestException('No puedes usar tu propio código de referido');
    }

    // Verificar que no haya sido referido antes
    const existingReferral = await this.prisma.referral.findUnique({
      where: { referredUserId: newUserId },
    });

    if (existingReferral) {
      throw new BadRequestException('Ya has sido referido por otro usuario');
    }

    // Crear registro de referido
    await this.prisma.referral.create({
      data: {
        referrerId: validation.referrerId,
        referredUserId: newUserId,
        status: 'pending',
      },
    });

    // Actualizar usuario referido
    await this.prisma.user.update({
      where: { id: newUserId },
      data: { referredBy: validation.referrerId },
    });

    // Recompensa inmediata al referidor por tener un nuevo referido
    const REGISTRATION_REWARD_POINTS = 50; // Puntos por cada nuevo referido registrado
    try {
      await this.rewardsService.addPoints(
        validation.referrerId,
        REGISTRATION_REWARD_POINTS,
        'referral_registration',
        'Puntos por referir a un nuevo usuario',
      );
    } catch (error) {
      console.error('Error al otorgar puntos de registro al referidor:', error);
      // No fallar el proceso si hay error con los puntos
    }
  }

  /**
   * Completa un referido cuando el usuario referido hace su primer pedido
   */
  async completeReferral(referredUserId: string): Promise<void> {
    const referral = await this.prisma.referral.findUnique({
      where: { referredUserId },
      include: { referrer: true },
    });

    if (!referral || referral.status !== 'pending') {
      return; // Ya fue completado o no existe
    }

    // Puntos para el referidor cuando el referido hace su primer pedido
    const FIRST_ORDER_REWARD_POINTS = 100;
    // Puntos para el referido
    const REFERRED_POINTS = 50;

    // Actualizar estado del referido
    await this.prisma.referral.update({
      where: { id: referral.id },
      data: {
        status: 'completed',
        completedAt: new Date(),
        rewardPoints: FIRST_ORDER_REWARD_POINTS,
      },
    });

    // Obtener nombre del usuario referido
    const referredUser = await this.prisma.user.findUnique({
      where: { id: referredUserId },
      select: { name: true },
    });

    // Otorgar puntos al referidor
    await this.rewardsService.addPoints(
      referral.referrerId,
      FIRST_ORDER_REWARD_POINTS,
      'referral_completed',
      `Puntos por referir a ${referredUser?.name || 'un amigo'} - Primer pedido`,
    );

    // Otorgar puntos al referido
    await this.rewardsService.addPoints(
      referredUserId,
      REFERRED_POINTS,
      'referral_bonus',
      'Puntos de bienvenida por ser referido',
    );

    // Actualizar contador de referidos del referidor
    await this.prisma.user.update({
      where: { id: referral.referrerId },
      data: {
        referralsCount: {
          increment: 1,
        },
      },
    });
  }

  /**
   * Otorga puntos al referidor cuando su referido hace una compra
   * Solo otorga puntos si la compra cumple con el monto mínimo
   */
  async processReferralPurchase(referredUserId: string, orderTotal: number): Promise<void> {
    // Monto mínimo para otorgar puntos (ej: $15.00)
    const MIN_ORDER_AMOUNT = 15.0;
    // Porcentaje de puntos basado en el total de la compra (ej: 5% del total)
    const POINTS_PERCENTAGE = 0.05;

    // Verificar monto mínimo
    if (orderTotal < MIN_ORDER_AMOUNT) {
      return; // No otorgar puntos si no cumple el monto mínimo
    }

    // Buscar el referido
    const referral = await this.prisma.referral.findUnique({
      where: { referredUserId },
    });

    if (!referral || referral.status !== 'completed') {
      return; // Solo otorgar puntos si el referido ya completó su primer pedido
    }

    // Calcular puntos (redondear hacia abajo)
    const pointsToAward = Math.floor(orderTotal * POINTS_PERCENTAGE);
    
    // Mínimo de puntos a otorgar (ej: 5 puntos)
    const MIN_POINTS = 5;
    const finalPoints = Math.max(MIN_POINTS, pointsToAward);

    // Obtener información del usuario referido
    const referredUser = await this.prisma.user.findUnique({
      where: { id: referredUserId },
      select: { name: true },
    });

    // Otorgar puntos al referidor
    try {
      await this.rewardsService.addPoints(
        referral.referrerId,
        finalPoints,
        'referral_purchase',
        `Puntos por compra de ${referredUser?.name || 'tu referido'} ($${orderTotal.toFixed(2)})`,
      );
    } catch (error) {
      console.error('Error al otorgar puntos por compra de referido:', error);
      // No fallar si hay error con los puntos
    }
  }

  /**
   * Obtiene estadísticas de referidos de un usuario
   */
  async getReferralStats(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const totalReferrals = await this.prisma.referral.count({
      where: { referrerId: userId },
    });

    const completedReferrals = await this.prisma.referral.count({
      where: { referrerId: userId, status: 'completed' },
    });

    const pendingReferrals = totalReferrals - completedReferrals;

    const totalPointsEarned = await this.prisma.referral.aggregate({
      where: { referrerId: userId, status: 'completed' },
      _sum: { rewardPoints: true },
    });

    const recentReferrals = await this.prisma.referral.findMany({
      where: { referrerId: userId, status: 'completed' },
      orderBy: { completedAt: 'desc' },
      take: 10,
    });

    return {
      referralCode: user.referralCode || await this.generateReferralCode(userId),
      totalReferrals,
      completedReferrals,
      pendingReferrals,
      totalPointsEarned: totalPointsEarned._sum.rewardPoints || 0,
      recentReferrals,
    };
  }

  /**
   * Genera un código aleatorio de 6-8 caracteres
   */
  private generateRandomCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }
}

