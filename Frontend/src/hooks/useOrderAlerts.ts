import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useToast } from './useToast';
import { useCurrentUser } from './useAuth';
import { orderStatusSounds } from '../utils/sounds';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001';

interface StatusChangeEvent {
  orderId: string;
  status: string;
  message?: string;
  timestamp: string;
}

interface OrderUpdateEvent {
  id: string;
  status: string;
  [key: string]: any;
}

export function useOrderAlerts(orderId?: string) {
  const { data: user } = useCurrentUser();
  const { success } = useToast();
  const socketRef = useRef<Socket | null>(null);
  const connectedRef = useRef(false);
  const lastStatusRef = useRef<string | null>(null);
  const lastTimestampRef = useRef<string | null>(null);

  useEffect(() => {
    if (!user || !orderId) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    // Conectar al WebSocket
    const socket = io(`${WS_URL}/orders`, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('✅ Conectado al WebSocket de pedidos');
      connectedRef.current = true;
      
      // Unirse a la sala del pedido
      socket.emit('join_order', orderId);
    });

    socket.on('disconnect', () => {
      console.log('❌ Desconectado del WebSocket');
      connectedRef.current = false;
    });

    // Escuchar cambios de estado
    socket.on('status_change', (data: StatusChangeEvent) => {
      if (data.orderId === orderId) {
        // Evitar procesar el mismo evento múltiples veces
        const eventKey = `${data.status}-${data.timestamp}`;
        if (lastStatusRef.current === data.status && lastTimestampRef.current === data.timestamp) {
          return; // Ya procesamos este evento
        }
        
        lastStatusRef.current = data.status;
        lastTimestampRef.current = data.timestamp;

        const statusMessages: Record<string, { title: string; emoji: string }> = {
          confirmed: { title: 'Pedido Confirmado', emoji: '✅' },
          preparing: { title: 'Preparando tu Pedido', emoji: '👨‍🍳' },
          ready: { title: 'Pedido Listo', emoji: '🎉' },
          on_the_way: { title: 'En Camino', emoji: '🚗' },
          delivered: { title: '¡Entregado!', emoji: '📦' },
          cancelled: { title: 'Pedido Cancelado', emoji: '❌' },
        };

        const statusInfo = statusMessages[data.status] || {
          title: 'Estado Actualizado',
          emoji: '📢',
        };

        // Reproducir sonido según el estado (solo si no es cancelado, para evitar el pitido)
        // El sonido de cancelación se maneja en el modal
        if (data.status !== 'cancelled') {
          const soundFunction = orderStatusSounds[data.status as keyof typeof orderStatusSounds];
          if (soundFunction) {
            soundFunction();
          }
        }

        // Mostrar alerta visual
        success(
          `${statusInfo.emoji} ${statusInfo.title}: ${data.message || `Tu pedido ahora está ${data.status}`}`
        );
      }
    });

    // Escuchar actualizaciones completas del pedido
    socket.on('order_update', (data: OrderUpdateEvent) => {
      if (data.id === orderId) {
        console.log('📦 Pedido actualizado:', data);
        // Aquí podrías actualizar el estado del pedido en el componente
      }
    });

    // Cleanup al desmontar
    return () => {
      if (socketRef.current) {
        socketRef.current.emit('leave_order', orderId);
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      // Resetear referencias
      lastStatusRef.current = null;
      lastTimestampRef.current = null;
    };
  }, [user, orderId]); // Removido 'success' de las dependencias para evitar reconexiones

  return {
    isConnected: connectedRef.current,
  };
}

