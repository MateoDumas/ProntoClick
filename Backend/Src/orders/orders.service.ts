import { Injectable, ForbiddenException, NotFoundException, Inject, forwardRef, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../Prisma/prisma.service';
import { Order, OrderItem, Prisma } from '@prisma/client';
import { CouponsService } from '../coupons/coupons.service';
import { RewardsService } from '../rewards/rewards.service';
import { OrdersWebSocketGateway } from '../websocket/websocket.gateway';
import { PaymentsService } from '../payments/payments.service';
import { NotificationsService } from '../notifications/notifications.service';
import { ReferralsService } from '../referrals/referrals.service';

interface CreateOrderDto {
  restaurantId: string;
  items: Array<{ 
    product: { id: string }; 
    quantity: number;
    price?: number; // Precio opcional para productos de mercado
  }>;
  deliveryAddress: {
    street: string;
    city: string;
    zipCode: string;
    notes?: string;
  };
  paymentMethod: 'cash' | 'card';
  couponCode?: string;
  paymentIntentId?: string; // ID del PaymentIntent de Stripe
  tipAmount?: number; // Propina para el repartidor
  isScheduled?: boolean; // Indica si el pedido está programado
  scheduledFor?: string; // Fecha y hora programada (ISO string)
}

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private couponsService: CouponsService,
    private rewardsService: RewardsService,
    private paymentsService: PaymentsService,
    private notificationsService: NotificationsService,
    private referralsService: ReferralsService,
    @Inject(forwardRef(() => OrdersWebSocketGateway))
    private webSocketGateway: OrdersWebSocketGateway,
  ) {}

  async create(userId: string, orderData: CreateOrderDto): Promise<Order> {
    // Validar fecha programada si es un pedido programado
    if (orderData.isScheduled && orderData.scheduledFor) {
      const scheduledDate = new Date(orderData.scheduledFor);
      const now = new Date();
      
      if (scheduledDate <= now) {
        throw new BadRequestException('La fecha programada debe ser en el futuro');
      }
      
      // Limitar a máximo 30 días en el futuro
      const maxDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      if (scheduledDate > maxDate) {
        throw new BadRequestException('No se pueden programar pedidos con más de 30 días de anticipación');
      }
    }

    let restaurantId = orderData.restaurantId;
    let isMarketOrder = restaurantId === 'market';
    
    // Si es una orden de mercado, crear o obtener el restaurante especial "market"
    if (isMarketOrder) {
      // Usar findUnique que es más eficiente que findFirst
      let marketRestaurant = await this.prisma.restaurant.findUnique({
        where: { id: 'market' },
      });

      if (!marketRestaurant) {
        // Crear restaurante especial para mercado si no existe
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
    } else {
      // Verificar que el restaurante existe para órdenes normales
      const restaurant = await this.prisma.restaurant.findUnique({
        where: { id: orderData.restaurantId },
      });

      if (!restaurant) {
        throw new NotFoundException('Restaurante no encontrado');
      }
    }

    // Calcular subtotal
    let subtotal = 0;
    const orderItemsData: Prisma.OrderItemCreateWithoutOrderInput[] = [];

    if (isMarketOrder) {
      // Para órdenes de mercado, optimizar consultas: buscar todos los productos de una vez
      const productIds = orderData.items.map((item) => item.product.id);
      const existingProducts = await this.prisma.product.findMany({
        where: { id: { in: productIds } },
      });

      const existingProductIds = new Set(existingProducts.map((p) => p.id));
      const productsToCreate = orderData.items
        .filter((item) => !existingProductIds.has(item.product.id))
        .map((item) => ({
          id: item.product.id,
          name: `Producto ${item.product.id}`,
          description: 'Producto de mercado',
          price: item.price || 0,
          restaurantId: restaurantId,
          category: 'market',
        }));

      // Crear productos faltantes en batch si hay alguno
      if (productsToCreate.length > 0) {
        await this.prisma.product.createMany({
          data: productsToCreate,
          skipDuplicates: true,
        });
      }

      // Crear un mapa de productos para acceso rápido
      const productsMap = new Map<string, { id: string; price: number }>();
      existingProducts.forEach((p) => {
        productsMap.set(p.id, { id: p.id, price: p.price });
      });
      productsToCreate.forEach((p) => {
        productsMap.set(p.id, { id: p.id, price: p.price });
      });

      // Procesar items usando el precio del frontend directamente
      for (const item of orderData.items) {
        const itemPrice = item.price || productsMap.get(item.product.id)?.price || 0;
        const itemTotal = itemPrice * item.quantity;
        subtotal += itemTotal;

        orderItemsData.push({
          product: { connect: { id: item.product.id } },
          quantity: item.quantity,
          price: itemPrice,
        });
      }
    } else {
      // Para órdenes normales, obtener productos de la BD
      const productIds = orderData.items.map((item) => item.product.id);
      const products = await this.prisma.product.findMany({
        where: { id: { in: productIds } },
      });

      if (products.length !== productIds.length) {
        throw new NotFoundException('Algunos productos no fueron encontrados');
      }

      for (const item of orderData.items) {
        const product = products.find((p) => p.id === item.product.id);
        if (!product) continue;

        const itemTotal = product.price * item.quantity;
        subtotal += itemTotal;

        orderItemsData.push({
          product: { connect: { id: product.id } },
          quantity: item.quantity,
          price: product.price,
        });
      }
    }

    // Calcular total con delivery fee e impuestos
    const deliveryFee = 2.99;
    const tax = subtotal * 0.1; // 10% de impuesto
    const tipAmount = orderData.tipAmount || 0;
    // Obtener penalización pendiente del usuario
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { pendingPenalty: true },
    });

    const pendingPenalty = user?.pendingPenalty || 0;

    let total = subtotal + deliveryFee + tax + tipAmount;
    let discountAmount = 0;
    let couponCode = null;

    // Aplicar cupón si existe
    if (orderData.couponCode) {
      try {
        const couponValidation = await this.couponsService.validateCoupon(
          orderData.couponCode,
          userId,
          subtotal,
          restaurantId === 'market' ? undefined : restaurantId,
        );
        
        discountAmount = couponValidation.discount;
        total = Math.max(0, total - discountAmount);
        couponCode = couponValidation.coupon.code;

        // Registrar el uso del cupón
        await this.couponsService.applyCoupon(userId, couponValidation.coupon.id, '');
      } catch (error) {
        // Si el cupón no es válido, continuar sin descuento
        console.error('Error al aplicar cupón:', error.message);
      }
    }

    // Determinar si es un pedido programado
    const isScheduled = Boolean(orderData.isScheduled && orderData.scheduledFor);

    // Aplicar penalización pendiente (si existe) - solo para pedidos inmediatos
    let appliedPenalty = 0;
    if (!isScheduled && pendingPenalty > 0) {
      appliedPenalty = pendingPenalty;
      total += appliedPenalty;
      
      // Limpiar la penalización pendiente después de aplicarla
      await this.prisma.user.update({
        where: { id: userId },
        data: { pendingPenalty: 0 },
      });
    }

    // Validar pago con Stripe si es pago con tarjeta (solo para pedidos inmediatos)
    if (!isScheduled && orderData.paymentMethod === 'card' && orderData.paymentIntentId) {
      try {
        await this.paymentsService.confirmPayment(orderData.paymentIntentId);
      } catch (error) {
        throw new BadRequestException('El pago no pudo ser confirmado: ' + error.message);
      }
    }

    // Si es un pedido programado, guardar los datos pero no crear los items aún
    const scheduledFor = isScheduled ? new Date(orderData.scheduledFor) : null;
    
    // Preparar datos del pedido programado
    const scheduledOrderData = isScheduled ? {
      items: orderData.items,
      deliveryAddress: orderData.deliveryAddress,
      paymentMethod: orderData.paymentMethod,
      couponCode: orderData.couponCode,
      tipAmount: orderData.tipAmount,
      restaurantId: orderData.restaurantId,
      subtotal,
      discountAmount,
      total,
    } : null;

    // Crear orden
    const order = await this.prisma.order.create({
      data: {
        userId,
        restaurantId: restaurantId,
        total,
        status: isScheduled ? 'scheduled' : 'pending',
        deliveryAddress: orderData.deliveryAddress as Prisma.InputJsonValue,
        paymentMethod: orderData.paymentMethod,
        couponCode,
        discountAmount: discountAmount > 0 ? discountAmount : null,
        tipAmount: tipAmount > 0 ? tipAmount : null,
        appliedPenalty: appliedPenalty > 0 ? appliedPenalty : null,
        isScheduled: Boolean(isScheduled),
        scheduledFor,
        scheduledOrderData: scheduledOrderData as Prisma.InputJsonValue,
        items: isScheduled ? undefined : {
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

    // Si es un pedido programado, no procesar pagos, puntos, emails, etc. aún
    if (!isScheduled) {
      // Agregar puntos al usuario por la compra
      try {
        await this.rewardsService.addPointsFromOrder(userId, order.id, total);
      } catch (error) {
        console.error('Error al agregar puntos:', error);
        // No fallar la orden si hay error con los puntos
      }

      // Emitir actualización de pedido vía WebSocket
      try {
        this.webSocketGateway.emitOrderUpdate(order.id, this.transformOrder(order));
        this.webSocketGateway.emitStatusChange(order.id, order.status, 'Pedido creado exitosamente');
      } catch (error) {
        console.error('Error al emitir actualización WebSocket:', error);
      }

      // Enviar email de confirmación
      try {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (user) {
          const orderWithItems = await this.prisma.order.findUnique({
            where: { id: order.id },
            include: { items: { include: { product: true } } },
          });
          const orderItems = orderWithItems?.items.map((item: any) => ({
            name: item.product.name,
            quantity: item.quantity,
            price: item.price * item.quantity,
          }));

          await this.notificationsService.sendOrderConfirmationEmail(
            user.email,
            user.name,
            order.id,
            order.total,
            orderItems,
          );
        }
      } catch (error) {
        console.error('Error al enviar email de confirmación:', error);
        // No fallar la orden si hay error con el email
      }

      // Completar referido si es el primer pedido del usuario
      try {
        const previousOrders = await this.prisma.order.count({
          where: { userId },
        });
        
        if (previousOrders === 1) {
          // Es el primer pedido, completar referido si existe
          await this.referralsService.completeReferral(userId);
        }
      } catch (error) {
        console.error('Error al completar referido:', error);
        // No fallar la orden si hay error con el referido
      }
    } else {
      // Para pedidos programados, enviar email de confirmación de programación
      try {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (user) {
          await this.notificationsService.sendOrderConfirmationEmail(
            user.email,
            user.name,
            order.id,
            order.total,
            orderData.items.map((item: any) => ({
              name: item.product?.name || 'Producto',
              quantity: item.quantity,
              price: (item.price || 0) * item.quantity,
            })),
          );
        }
      } catch (error) {
        console.error('Error al enviar email de confirmación de pedido programado:', error);
      }
    }

    // Transformar para que coincida con el formato del frontend
    return this.transformOrder(order, appliedPenalty);
  }

  private transformOrder(order: any, appliedPenalty?: number) {
    return {
      id: order.id,
      userId: order.userId,
      restaurantId: order.restaurantId,
      items: order.items ? order.items.map((item: any) => ({
        product: item.product,
        quantity: item.quantity,
      })) : [],
      total: order.total,
      status: order.status,
      deliveryAddress: order.deliveryAddress,
      paymentMethod: order.paymentMethod,
      couponCode: order.couponCode || null,
      discountAmount: order.discountAmount || null,
      tipAmount: order.tipAmount || null,
      appliedPenalty: appliedPenalty !== undefined ? appliedPenalty : (order.appliedPenalty || null),
      isScheduled: Boolean(order.isScheduled || false),
      scheduledFor: order.scheduledFor ? order.scheduledFor.toISOString() : null,
      scheduledOrderData: order.scheduledOrderData || null,
      cancellationReason: order.cancellationReason || null,
      cancellationFee: order.cancellationFee || null,
      cancelledAt: order.cancelledAt ? order.cancelledAt.toISOString() : null,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    };
  }

  async findAll(userId: string): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      where: { userId },
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
      orderBy: { createdAt: 'desc' },
    });

    return orders.map((order) => this.transformOrder(order));
  }

  async findOne(id: string, userId: string): Promise<Order> {
    const order = await this.prisma.order.findUnique({
      where: { id },
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
            description: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Pedido no encontrado');
    }

    if (order.userId !== userId) {
      throw new ForbiddenException('No tienes permiso para ver este pedido');
    }

    return this.transformOrder(order);
  }

  async updateStatus(orderId: string, userId: string, newStatus: string): Promise<Order> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Pedido no encontrado');
    }

    if (order.userId !== userId) {
      throw new ForbiddenException('No tienes permiso para modificar este pedido');
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        restaurant: true,
      },
    });

    // Emitir actualización vía WebSocket
    try {
      this.webSocketGateway.emitOrderUpdate(orderId, this.transformOrder(updatedOrder));
      this.webSocketGateway.emitStatusChange(orderId, newStatus, `Estado actualizado a: ${newStatus}`);
    } catch (error) {
      console.error('Error al emitir actualización WebSocket:', error);
    }

    // Enviar email de actualización de estado
    try {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (user) {
        const statusMessages: Record<string, string> = {
          confirmed: 'Tu pedido ha sido confirmado y está siendo preparado.',
          preparing: 'Tu pedido está siendo preparado.',
          ready: 'Tu pedido está listo y saldrá en camino pronto.',
          delivered: '¡Tu pedido ha sido entregado! ¡Esperamos que lo disfrutes!',
          cancelled: 'Tu pedido ha sido cancelado.',
        };

        await this.notificationsService.sendOrderStatusUpdateEmail(
          user.email,
          user.name,
          orderId,
          newStatus,
          statusMessages[newStatus] || `Estado actualizado a: ${newStatus}`,
        );
      }
    } catch (error) {
      console.error('Error al enviar email de actualización:', error);
      // No fallar la actualización si hay error con el email
    }


    return this.transformOrder(updatedOrder);
  }

  async cancelOrder(
    orderId: string,
    userId: string,
    cancelData: { reason: string; additionalNotes?: string },
  ): Promise<Order> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        restaurant: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Pedido no encontrado');
    }

    if (order.userId !== userId) {
      throw new ForbiddenException('No tienes permiso para cancelar este pedido');
    }

    // Validar que el pedido se pueda cancelar
    if (order.status === 'cancelled') {
      throw new BadRequestException('El pedido ya está cancelado');
    }

    if (order.status === 'delivered') {
      throw new BadRequestException('No se puede cancelar un pedido ya entregado');
    }

    // Calcular costo de cancelación si el pedido está en camino
    let cancellationFee: number | null = null;
    if (order.status === 'on_the_way') {
      // 20% del total como costo de cancelación
      cancellationFee = order.total * 0.2;
    }

    // Actualizar el pedido
    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'cancelled',
        cancellationReason: cancelData.reason,
        cancellationFee,
        cancelledAt: new Date(),
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

    // Crear reporte de cancelación
    await this.prisma.report.create({
      data: {
        userId,
        orderId,
        type: 'cancellation',
        reason: cancelData.reason,
        fee: cancellationFee,
        status: 'pending',
        notes: cancelData.additionalNotes || null,
      },
    });

    // Agregar penalización del 5% del pedido cancelado (se aplicará en el próximo pedido)
    const penaltyAmount = order.total * 0.05;
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        pendingPenalty: {
          increment: penaltyAmount,
        },
      },
    });

    // Emitir actualización vía WebSocket
    try {
      this.webSocketGateway.emitOrderUpdate(orderId, this.transformOrder(updatedOrder));
      this.webSocketGateway.emitStatusChange(
        orderId,
        'cancelled',
        `Pedido cancelado: ${cancelData.reason}`,
      );
    } catch (error) {
      console.error('Error al emitir actualización WebSocket:', error);
    }

    // Enviar email de cancelación
    try {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (user) {
        await this.notificationsService.sendOrderStatusUpdateEmail(
          user.email,
          user.name,
          orderId,
          'cancelled',
          `Tu pedido ha sido cancelado. ${cancellationFee ? `Se aplicará un cargo de $${cancellationFee.toFixed(2)} por cancelación.` : ''}`,
        );
      }
    } catch (error) {
      console.error('Error al enviar email de cancelación:', error);
    }

    return this.transformOrder(updatedOrder);
  }
}

