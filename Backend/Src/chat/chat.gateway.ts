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
import { ChatService } from './chat.service';

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST'],
  },
  namespace: '/chat',
  transports: ['websocket', 'polling'],
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private jwtService: JwtService,
    private chatService: ChatService,
  ) {}

  async handleConnection(client: AuthenticatedSocket) {
    try {
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers?.authorization?.replace('Bearer ', '') ||
        client.handshake.query?.token;

      if (token) {
        try {
          const payload = this.jwtService.verify(token);
          client.userId = payload.id || payload.sub;
          client.join(`user:${client.userId}`);
          console.log(`✅ Cliente de chat conectado: ${client.userId}`);
        } catch (verifyError) {
          console.error('❌ Error al verificar token de chat:', verifyError);
          client.disconnect();
        }
      } else {
        console.log('⚠️ Cliente de chat sin token, desconectando...');
        client.disconnect();
      }
    } catch (error) {
      console.error('❌ Error en handleConnection de chat:', error);
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    console.log(`Cliente de chat desconectado: ${client.userId || 'anónimo'}`);
  }

  @SubscribeMessage('join_session')
  async handleJoinSession(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() sessionId: string,
  ) {
    if (!client.userId) {
      return { error: 'No autenticado' };
    }

    try {
      // Verificar que la sesión pertenece al usuario
      await this.chatService.getSession(sessionId, client.userId);
      client.join(`session:${sessionId}`);
      return { success: true, sessionId };
    } catch (error) {
      return { error: error.message };
    }
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { content: string; sessionId?: string },
  ) {
    if (!client.userId) {
      return { error: 'No autenticado' };
    }

    try {
      const result = await this.chatService.sendMessage(client.userId, {
        content: data.content,
        sessionId: data.sessionId,
      });

      // Emitir mensaje a todos los clientes en la sesión
      // Si hay respuesta del asistente, emitirla; si no, solo emitir el mensaje del usuario
      // (esto ocurre cuando el usuario está conectado con soporte humano)
      this.server.to(`session:${result.sessionId}`).emit('new_message', {
        userMessage: result.userMessage,
        assistantMessage: result.assistantMessage, // Puede ser null si está conectado con soporte humano
      });

      return {
        success: true,
        userMessage: result.userMessage,
        assistantMessage: result.assistantMessage,
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  @SubscribeMessage('leave_session')
  handleLeaveSession(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() sessionId: string,
  ) {
    client.leave(`session:${sessionId}`);
    return { success: true };
  }
}

