import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../Prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getUserReports(userId: string) {
    return this.prisma.report.findMany({
      where: { userId },
      include: {
        order: {
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
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getReportById(reportId: string, userId: string) {
    const report = await this.prisma.report.findUnique({
      where: { id: reportId },
      include: {
        order: {
          include: {
            restaurant: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            items: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    if (!report) {
      throw new NotFoundException('Reporte no encontrado');
    }

    if (report.userId !== userId) {
      throw new ForbiddenException('No tienes permiso para ver este reporte');
    }

    return report;
  }

  async createReport(userId: string, data: {
    orderId: string;
    type: string;
    reason: string;
    description?: string;
  }) {
    // Verificar que el pedido existe y pertenece al usuario
    const order = await this.prisma.order.findUnique({
      where: { id: data.orderId },
    });

    if (!order) {
      throw new NotFoundException('Pedido no encontrado');
    }

    if (order.userId !== userId) {
      throw new ForbiddenException('No tienes permiso para crear un reporte de este pedido');
    }

    return this.prisma.report.create({
      data: {
        userId,
        orderId: data.orderId,
        type: data.type,
        reason: data.reason,
        notes: data.description || null,
        status: 'pending',
      },
      include: {
        order: {
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
}

