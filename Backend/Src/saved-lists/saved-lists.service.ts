import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../Prisma/prisma.service';

interface SavedListItem {
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    image?: string | null;
    restaurantId: string;
  };
}

@Injectable()
export class SavedListsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: { name: string; description?: string; items: SavedListItem[] }) {
    return this.prisma.savedList.create({
      data: {
        userId,
        name: data.name,
        description: data.description,
        items: data.items as any,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.savedList.findMany({
      where: { userId },
      orderBy: [
        { isFavorite: 'desc' },
        { updatedAt: 'desc' },
      ],
    });
  }

  async findOne(userId: string, listId: string) {
    const list = await this.prisma.savedList.findUnique({
      where: { id: listId },
    });

    if (!list) {
      throw new NotFoundException('Lista no encontrada');
    }

    if (list.userId !== userId) {
      throw new ForbiddenException('No tienes permiso para acceder a esta lista');
    }

    return list;
  }

  async update(userId: string, listId: string, data: { name?: string; description?: string; items?: SavedListItem[] }) {
    const list = await this.findOne(userId, listId);

    return this.prisma.savedList.update({
      where: { id: listId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.items && { items: data.items as any }),
      },
    });
  }

  async delete(userId: string, listId: string) {
    await this.findOne(userId, listId);
    await this.prisma.savedList.delete({
      where: { id: listId },
    });
  }

  async toggleFavorite(userId: string, listId: string) {
    const list = await this.findOne(userId, listId);
    return this.prisma.savedList.update({
      where: { id: listId },
      data: { isFavorite: !list.isFavorite },
    });
  }
}

