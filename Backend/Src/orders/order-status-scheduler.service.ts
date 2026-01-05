import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../Prisma/prisma.service';
import { OrdersWebSocketGateway } from '../websocket/websocket.gateway';

@Injectable()
export class OrderStatusSchedulerService implements OnModuleInit {
  constructor(
    private prisma: PrismaService,
    private webSocketGateway: OrdersWebSocketGateway,
  ) {}

  onModuleInit() {
    // Iniciar el scheduler cuando el módulo se inicializa
    this.startStatusScheduler();
  }

  private async startStatusScheduler() {
    // En desarrollo, revisar cada 5 segundos para pruebas rápidas
    const interval = process.env.NODE_ENV === 'production' ? 30000 : 5000;
    setInterval(async () => {
      await this.processPendingOrders();
    }, interval);
  }

  private async processPendingOrders() {
    try {
      // Obtener pedidos pendientes que necesitan actualización
      // Usar $queryRawUnsafe para evitar prepared statements que causan problemas con pooling
      const pendingOrders = await this.prisma.order.findMany({
        where: {
          status: {
            in: ['pending', 'confirmed', 'preparing', 'ready', 'on_the_way'],
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
        orderBy: {
          createdAt: 'asc',
        },
        take: 10, // Procesar máximo 10 pedidos a la vez
      });

      for (const order of pendingOrders) {
        // Calcular tiempo desde la última actualización (updatedAt) para estados que ya cambiaron
        // O desde la creación para el estado inicial
        const referenceTime = order.status === 'pending' 
          ? new Date(order.createdAt).getTime()
          : new Date(order.updatedAt).getTime();
        
        const timeSinceReference = Date.now() - referenceTime;
        const secondsSinceReference = Math.floor(timeSinceReference / 1000);
        
        // En producción usar minutos, en desarrollo usar segundos para pruebas rápidas
        const isProduction = process.env.NODE_ENV === 'production';
        const timeUnit = isProduction ? Math.floor(secondsSinceReference / 60) : secondsSinceReference;

        let newStatus: string | null = null;

        // Lógica de transición de estados basada en tiempo desde la última actualización
        if (isProduction) {
          // Tiempos de producción (en minutos desde último cambio) - Total: ~5 minutos
          switch (order.status) {
            case 'pending':
              if (timeUnit >= 0.5) newStatus = 'confirmed'; // 30 segundos
              break;
            case 'confirmed':
              if (timeUnit >= 1) newStatus = 'preparing'; // 1 minuto desde confirmado
              break;
            case 'preparing':
              if (timeUnit >= 2) newStatus = 'ready'; // 2 minutos desde preparación
              break;
            case 'ready':
              if (timeUnit >= 0.5) newStatus = 'on_the_way'; // 30 segundos desde listo
              break;
            case 'on_the_way':
              if (timeUnit >= 1) newStatus = 'delivered'; // 1 minuto desde en camino
              break;
          }
        } else {
          // Tiempos de desarrollo (en segundos desde último cambio) - Total: ~30 segundos para pruebas rápidas
          switch (order.status) {
            case 'pending':
              if (timeUnit >= 3) newStatus = 'confirmed'; // 3 segundos
              break;
            case 'confirmed':
              if (timeUnit >= 5) newStatus = 'preparing'; // 5 segundos desde confirmado
              break;
            case 'preparing':
              if (timeUnit >= 10) newStatus = 'ready'; // 10 segundos desde preparación
              break;
            case 'ready':
              if (timeUnit >= 3) newStatus = 'on_the_way'; // 3 segundos desde listo
              break;
            case 'on_the_way':
              if (timeUnit >= 5) newStatus = 'delivered'; // 5 segundos desde en camino
              break;
          }
        }

        if (newStatus) {
          await this.updateOrderStatus(order.id, newStatus);
        }
      }
    } catch (error: any) {
      // Si es error de prepared statement, intentar reconectar
      if (error?.message?.includes('prepared statement') || error?.code === '26000') {
        console.warn('Error de prepared statement detectado, intentando reconectar...');
        try {
          await this.prisma.$disconnect();
          await this.prisma.$connect();
          console.log('Reconexión exitosa');
        } catch (reconnectError) {
          console.error('Error al reconectar:', reconnectError);
        }
      } else {
        console.error('Error en el scheduler de estados:', error);
      }
    }
  }

  private async updateOrderStatus(orderId: string, newStatus: string) {
    try {
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
      this.webSocketGateway.emitOrderUpdate(orderId, this.transformOrder(updatedOrder));
      
      const statusMessages: Record<string, string> = {
        confirmed: 'Tu pedido ha sido confirmado',
        preparing: 'Tu pedido está siendo preparado',
        ready: 'Tu pedido está listo para recoger',
        on_the_way: 'Tu pedido está en camino',
        delivered: '¡Tu pedido ha sido entregado!',
      };

      this.webSocketGateway.emitStatusChange(
        orderId,
        newStatus,
        statusMessages[newStatus] || `Estado actualizado a: ${newStatus}`,
      );

      console.log(`✅ Estado del pedido ${orderId} actualizado a: ${newStatus}`);
    } catch (error) {
      console.error(`Error al actualizar estado del pedido ${orderId}:`, error);
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
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    };
  }
}

