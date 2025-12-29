import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../Prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: {
    restaurantId?: string;
    productId?: string;
    orderId?: string;
    rating: number;
    comment?: string;
  }) {
    // Validar que el rating esté entre 1 y 5
    if (data.rating < 1 || data.rating > 5) {
      throw new BadRequestException('El rating debe estar entre 1 y 5');
    }

    // Validar que se proporcione restaurantId o productId
    if (!data.restaurantId && !data.productId) {
      throw new BadRequestException('Debe proporcionar restaurantId o productId');
    }

    // Si hay orderId, verificar que el pedido pertenezca al usuario
    if (data.orderId) {
      const order = await this.prisma.order.findUnique({
        where: { id: data.orderId },
      });

      if (!order) {
        throw new NotFoundException('Pedido no encontrado');
      }

      if (order.userId !== userId) {
        throw new ForbiddenException('No tienes permiso para reseñar este pedido');
      }
    }

    // Crear la reseña
    const review = await this.prisma.review.create({
      data: {
        userId,
        restaurantId: data.restaurantId,
        productId: data.productId,
        orderId: data.orderId,
        rating: data.rating,
        comment: data.comment,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    // Actualizar el rating promedio del restaurante o producto
    await this.updateAverageRating(data.restaurantId, data.productId);

    return review;
  }

  async getByRestaurant(restaurantId: string) {
    const reviews = await this.prisma.review.findMany({
      where: { restaurantId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const averageRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : null;

    return {
      reviews,
      averageRating: averageRating ? Math.round(averageRating * 10) / 10 : null,
      totalReviews: reviews.length,
    };
  }

  async getByProduct(productId: string) {
    const reviews = await this.prisma.review.findMany({
      where: { productId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const averageRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : null;

    return {
      reviews,
      averageRating: averageRating ? Math.round(averageRating * 10) / 10 : null,
      totalReviews: reviews.length,
    };
  }

  async getUserReview(userId: string, restaurantId?: string, productId?: string, orderId?: string) {
    const where: any = { userId };
    if (restaurantId) where.restaurantId = restaurantId;
    if (productId) where.productId = productId;
    if (orderId) where.orderId = orderId;

    return this.prisma.review.findFirst({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });
  }

  async update(userId: string, reviewId: string, data: { rating?: number; comment?: string }) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException('Reseña no encontrada');
    }

    if (review.userId !== userId) {
      throw new ForbiddenException('No tienes permiso para editar esta reseña');
    }

    if (data.rating && (data.rating < 1 || data.rating > 5)) {
      throw new BadRequestException('El rating debe estar entre 1 y 5');
    }

    const updated = await this.prisma.review.update({
      where: { id: reviewId },
      data: {
        rating: data.rating ?? review.rating,
        comment: data.comment ?? review.comment,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    // Actualizar rating promedio
    await this.updateAverageRating(review.restaurantId, review.productId);

    return updated;
  }

  async delete(userId: string, reviewId: string) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException('Reseña no encontrada');
    }

    if (review.userId !== userId) {
      throw new ForbiddenException('No tienes permiso para eliminar esta reseña');
    }

    const restaurantId = review.restaurantId;
    const productId = review.productId;

    await this.prisma.review.delete({
      where: { id: reviewId },
    });

    // Actualizar rating promedio
    await this.updateAverageRating(restaurantId, productId);
  }

  private async updateAverageRating(restaurantId?: string | null, productId?: string | null) {
    if (restaurantId) {
      const reviews = await this.prisma.review.findMany({
        where: { restaurantId },
        select: { rating: true },
      });

      const averageRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : null;

      await this.prisma.restaurant.update({
        where: { id: restaurantId },
        data: { rating: averageRating },
      });
    }

    // Para productos, podríamos agregar un campo rating si lo necesitamos
    // Por ahora solo actualizamos restaurantes
  }
}

