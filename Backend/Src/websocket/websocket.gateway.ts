import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST'],
  },
  namespace: '/orders',
  transports: ['websocket', 'polling'],
})
export class OrdersWebSocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private jwtService: JwtService) {}

  async handleConnection(client: AuthenticatedSocket) {
    try {
      const token = client.handshake.auth?.token || 
                    client.handshake.headers?.authorization?.replace('Bearer ', '') ||
                    client.handshake.query?.token;
      
      if (token) {
        try {
          const payload = this.jwtService.verify(token);
          client.userId = payload.id || payload.sub;
          client.join(`user:${client.userId}`);
          console.log(`✅ Cliente WebSocket conectado: ${client.userId}`);
        } catch (verifyError) {
          console.error('❌ Error al verificar token WebSocket:', verifyError);
          // No desconectar, permitir conexión sin autenticación para debugging
        }
      } else {
        console.log('⚠️ Cliente WebSocket conectado sin token (modo anónimo)');
      }
    } catch (error) {
      console.error('❌ Error en handleConnection WebSocket:', error);
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    console.log(`Cliente desconectado: ${client.userId || 'anónimo'}`);
  }

  @SubscribeMessage('join_order')
  handleJoinOrder(@ConnectedSocket() client: AuthenticatedSocket, @MessageBody() orderId: string) {
    if (client.userId) {
      client.join(`order:${orderId}`);
      console.log(`Usuario ${client.userId} se unió al pedido ${orderId}`);
    }
  }

  @SubscribeMessage('leave_order')
  handleLeaveOrder(@ConnectedSocket() client: AuthenticatedSocket, @MessageBody() orderId: string) {
    client.leave(`order:${orderId}`);
    console.log(`Usuario ${client.userId} salió del pedido ${orderId}`);
  }

  // Método para emitir actualizaciones de estado de pedido
  emitOrderUpdate(orderId: string, orderData: any) {
    this.server.to(`order:${orderId}`).emit('order_update', orderData);
  }

  // Método para emitir actualización de ubicación del repartidor
  emitDeliveryLocation(orderId: string, location: { lat: number; lng: number }) {
    this.server.to(`order:${orderId}`).emit('delivery_location', {
      orderId,
      location,
      timestamp: new Date().toISOString(),
    });
  }

  // Método para notificar cambio de estado
  emitStatusChange(orderId: string, status: string, message?: string) {
    this.server.to(`order:${orderId}`).emit('status_change', {
      orderId,
      status,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}

