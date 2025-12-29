import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../Prisma/prisma.service';

@Injectable()
export class AddressesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: {
    label: string;
    street: string;
    city: string;
    zipCode: string;
    notes?: string;
    isDefault?: boolean;
  }) {
    // Si se marca como default, quitar el default de otras direcciones
    if (data.isDefault) {
      await this.prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    return this.prisma.address.create({
      data: {
        userId,
        ...data,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' },
      ],
    });
  }

  async findOne(userId: string, addressId: string) {
    const address = await this.prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!address) {
      throw new NotFoundException('Dirección no encontrada');
    }

    if (address.userId !== userId) {
      throw new BadRequestException('No tienes permiso para ver esta dirección');
    }

    return address;
  }

  async update(userId: string, addressId: string, data: {
    label?: string;
    street?: string;
    city?: string;
    zipCode?: string;
    notes?: string;
    isDefault?: boolean;
  }) {
    const address = await this.findOne(userId, addressId);

    // Si se marca como default, quitar el default de otras direcciones
    if (data.isDefault) {
      await this.prisma.address.updateMany({
        where: { userId, isDefault: true, id: { not: addressId } },
        data: { isDefault: false },
      });
    }

    return this.prisma.address.update({
      where: { id: addressId },
      data,
    });
  }

  async delete(userId: string, addressId: string) {
    await this.findOne(userId, addressId);
    await this.prisma.address.delete({
      where: { id: addressId },
    });
    return { message: 'Dirección eliminada correctamente' };
  }

  async setDefault(userId: string, addressId: string) {
    await this.findOne(userId, addressId);

    // Quitar default de todas las direcciones
    await this.prisma.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });

    // Marcar esta como default
    return this.prisma.address.update({
      where: { id: addressId },
      data: { isDefault: true },
    });
  }
}

