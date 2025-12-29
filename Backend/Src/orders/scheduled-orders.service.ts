import { Injectable, OnModuleInit, Inject, forwardRef, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../Prisma/prisma.service';
import { OrdersService } from './orders.service';
import { PaymentsService } from '../payments/payments.service';
import { RewardsService } from '../rewards/rewards.service';
import { NotificationsService } from '../notifications/notifications.service';
import { ReferralsService } from '../referrals/referrals.service';
import { OrdersWebSocketGateway } from '../websocket/websocket.gateway';
import { Prisma } from '@prisma/client';

@Injectable()
export class ScheduledOrdersService implements OnModuleInit {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => OrdersService))
    private ordersService: OrdersService,
    private paymentsService: PaymentsService,
    private rewardsService: RewardsService,
    private notificationsService: NotificationsService,
    private referralsService: ReferralsService,
    @Inject(forwardRef(() => OrdersWebSocketGateway))
    private webSocketGateway: OrdersWebSocketGateway,
  ) {}

  onModuleInit() {
    // Iniciar el scheduler cuando el módulo se inicializa
    this.startScheduledOrdersScheduler();
  }

  private async startScheduledOrdersScheduler() {
    // Revisar cada minuto los pedidos programados
    const interval = 60000; // 1 minuto
    setInterval(async () => {
      await this.processScheduledOrders();
    }, interval);
    
    // Ejecutar inmediatamente al iniciar
    this.processScheduledOrders();
  }

  private async processScheduledOrders() {
    try {
      const now = new Date();
      
      // Buscar pedidos programados que deben ejecutarse ahora
      const scheduledOrders = await this.prisma.order.findMany({
        where: {
          isScheduled: true,
          status: 'scheduled',
          scheduledFor: {
            lte: now, // scheduledFor <= now
          },
        },
        include: {
          user: true,
          restaurant: true,
        },
      });

      for (const scheduledOrder of scheduledOrders) {
        await this.executeScheduledOrder(scheduledOrder);
      }
    } catch (error) {
      console.error('Error al procesar pedidos programados:', error);
    }
  }

  private async executeScheduledOrder(scheduledOrder: any) {
    try {
      console.log(`🕐 Ejecutando pedido programado: ${scheduledOrder.id}`);
      
      const scheduledData = scheduledOrder.scheduledOrderData as any;
      if (!scheduledData) {
        throw new BadRequestException('Datos del pedido programado no encontrados');
      }

      // Preparar datos para crear los items del pedido
      const orderItemsData: Prisma.OrderItemCreateWithoutOrderInput[] = [];
      let restaurantId = scheduledData.restaurantId;
      let isMarketOrder = restaurantId === 'market';

      // Verificar o crear restaurante si es mercado
      if (isMarketOrder) {
        let marketRestaurant = await this.prisma.restaurant.findUnique({
          where: { id: 'market' },
        });

        if (!marketRestaurant) {
          marketRestaurant = await this.prisma.restaurant.create({
            data: {
              id: 'market',
              name: 'Mercado ProntoClick',
              description: 'Productos de mercado y supermercado',
              image: null,
              rating: null,
              deliveryTime: '30-45 min',
              minOrder: 0,
            },
          });
        }
        restaurantId = marketRestaurant.id;
      }

      // Procesar items del pedido programado
      if (isMarketOrder) {
        const productIds = scheduledData.items.map((item: any) => item.product.id);
        const existingProducts = await this.prisma.product.findMany({
          where: { id: { in: productIds } },
        });

        const existingProductIds = new Set(existingProducts.map((p) => p.id));
        const productsToCreate = scheduledData.items
          .filter((item: any) => !existingProductIds.has(item.product.id))
          .map((item: any) => ({
            id: item.product.id,
            name: item.product.name || `Producto ${item.product.id}`,
            description: 'Producto de mercado',
            price: item.price || 0,
            restaurantId: restaurantId,
            category: 'market',
          }));

        if (productsToCreate.length > 0) {
          await this.prisma.product.createMany({
            data: productsToCreate,
            skipDuplicates: true,
          });
        }

        const productsMap = new Map<string, { id: string; price: number }>();
        existingProducts.forEach((p) => {
          productsMap.set(p.id, { id: p.id, price: p.price });
        });
        productsToCreate.forEach((p) => {
          productsMap.set(p.id, { id: p.id, price: p.price });
        });

        for (const item of scheduledData.items) {
          const itemPrice = item.price || productsMap.get(item.product.id)?.price || 0;
          orderItemsData.push({
            product: { connect: { id: item.product.id } },
            quantity: item.quantity,
            price: itemPrice,
          });
        }
      } else {
        const productIds = scheduledData.items.map((item: any) => item.product.id);
        const products = await this.prisma.product.findMany({
          where: { id: { in: productIds } },
        });

        for (const item of scheduledData.items) {
          const product = products.find((p) => p.id === item.product.id);
          if (!product) continue;

          orderItemsData.push({
            product: { connect: { id: product.id } },
            quantity: item.quantity,
            price: product.price,
          });
        }
      }

      // Validar pago con Stripe si es pago con tarjeta
      // Nota: Para pedidos programados, el pago debería haberse procesado al crear el pedido
      // pero aquí validamos que el método de pago sea válido
      if (scheduledData.paymentMethod === 'card') {
        // Si hay un paymentIntentId guardado, debería validarse aquí
        // Por ahora, asumimos que el pago ya fue procesado
        console.log('Pedido programado con pago con tarjeta - asumiendo pago ya procesado');
      }

      // Actualizar el pedido: crear items y cambiar estado
      const updatedOrder = await this.prisma.order.update({
        where: { id: scheduledOrder.id },
        data: {
          status: 'pending',
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          restaurant: true,
        },
      });

      // Agregar puntos al usuario por la compra
      try {
        await this.rewardsService.addPointsFromOrder(
          scheduledOrder.userId,
          updatedOrder.id,
          scheduledOrder.total,
        );
      } catch (error) {
        console.error('Error al agregar puntos:', error);
      }

      // Emitir actualización de pedido vía WebSocket
      try {
        this.webSocketGateway.emitOrderUpdate(
          updatedOrder.id,
          this.transformOrder(updatedOrder),
        );
        this.webSocketGateway.emitStatusChange(
          updatedOrder.id,
          'pending',
          'Tu pedido programado ha sido ejecutado y está siendo procesado',
        );
      } catch (error) {
        console.error('Error al emitir actualización WebSocket:', error);
      }

      // Enviar email de confirmación
      try {
        const orderItems = updatedOrder.items.map((item: any) => ({
          name: item.product.name,
          quantity: item.quantity,
          price: item.price * item.quantity,
        }));

        await this.notificationsService.sendOrderConfirmationEmail(
          scheduledOrder.user.email,
          scheduledOrder.user.name,
          updatedOrder.id,
          updatedOrder.total,
          orderItems,
        );
      } catch (error) {
        console.error('Error al enviar email de confirmación:', error);
      }

      // Completar referido si es el primer pedido del usuario
      try {
        const previousOrders = await this.prisma.order.count({
          where: {
            userId: scheduledOrder.userId,
            status: { not: 'scheduled' },
          },
        });

        if (previousOrders === 1) {
          await this.referralsService.completeReferral(scheduledOrder.userId);
        }
      } catch (error) {
        console.error('Error al completar referido:', error);
      }

      console.log(`✅ Pedido programado ${scheduledOrder.id} ejecutado exitosamente`);
    } catch (error) {
      console.error(`❌ Error al ejecutar pedido programado ${scheduledOrder.id}:`, error);
      
      // Marcar el pedido como error para que no se intente ejecutar infinitamente
      try {
        await this.prisma.order.update({
          where: { id: scheduledOrder.id },
          data: {
            status: 'cancelled',
          },
        });
      } catch (updateError) {
        console.error('Error al actualizar estado del pedido a cancelled:', updateError);
      }
    }
  }

  private transformOrder(order: any) {
    return {
      id: order.id,
      userId: order.userId,
      restaurantId: order.restaurantId,
      items: order.items.map((item: any) => ({
        product: item.product,
        quantity: item.quantity,
      })),
      total: order.total,
      status: order.status,
      deliveryAddress: order.deliveryAddress,
      paymentMethod: order.paymentMethod,
      couponCode: order.couponCode || null,
      discountAmount: order.discountAmount || null,
      tipAmount: order.tipAmount || null,
      isScheduled: order.isScheduled || false,
      scheduledFor: order.scheduledFor ? order.scheduledFor.toISOString() : null,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    };
  }

  /**
   * Obtiene todos los pedidos programados de un usuario
   */
  async getScheduledOrders(userId: string) {
    const scheduledOrders = await this.prisma.order.findMany({
      where: {
        userId,
        isScheduled: true,
        status: 'scheduled',
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        restaurant: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        scheduledFor: 'asc',
      },
    });

    return scheduledOrders.map((order) => this.transformOrder(order));
  }

  /**
   * Cancela un pedido programado
   */
  async cancelScheduledOrder(orderId: string, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Pedido no encontrado');
    }

    if (order.userId !== userId) {
      throw new ForbiddenException('No tienes permiso para cancelar este pedido');
    }

    if (!order.isScheduled || order.status !== 'scheduled') {
      throw new BadRequestException('Este pedido no es un pedido programado activo');
    }

    const cancelledOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'cancelled',
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        restaurant: true,
      },
    });

    return this.transformOrder(cancelledOrder);
  }
}

