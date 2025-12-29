import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

export function useSocket(namespace: string = '/orders') {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const token = getToken();
    
    if (!token) {
      console.warn('No hay token, no se puede conectar al WebSocket');
      return;
    }

    console.log(`Intentando conectar a WebSocket: ${API_URL}${namespace}`);

    const newSocket = io(`${API_URL}${namespace}`, {
      auth: {
        token,
      },
      transports: ['polling', 'websocket'], // Intentar polling primero
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      timeout: 20000,
      forceNew: true,
    });

    newSocket.on('connect', () => {
      console.log('✅ Conectado a WebSocket exitosamente');
      setIsConnected(true);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('❌ Desconectado de WebSocket:', reason);
      setIsConnected(false);
      
      // Intentar reconectar automáticamente si no fue un cierre intencional
      if (reason === 'io server disconnect' || reason === 'transport close') {
        // El cliente será desconectado, pero el reconnection automático se encargará
        console.log('🔄 Intentando reconectar...');
      }
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ Error de conexión WebSocket:', error.message);
      setIsConnected(false);
    });

    newSocket.on('reconnect', (attemptNumber) => {
      console.log(`🔄 Reconectado después de ${attemptNumber} intentos`);
      setIsConnected(true);
    });

    newSocket.on('reconnect_error', (error) => {
      console.error('❌ Error al reconectar:', error.message);
    });

    newSocket.on('reconnect_failed', () => {
      console.error('❌ Falló la reconexión después de múltiples intentos');
      setIsConnected(false);
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    return () => {
      console.log('Cerrando conexión WebSocket');
      newSocket.close();
    };
  }, [namespace]);

  const joinOrder = (orderId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('join_order', orderId);
    }
  };

  const leaveOrder = (orderId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('leave_order', orderId);
    }
  };

  const onOrderUpdate = (callback: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.on('order_update', callback);
      return () => {
        socketRef.current?.off('order_update', callback);
      };
    }
  };

  const onStatusChange = (callback: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.on('status_change', callback);
      return () => {
        socketRef.current?.off('status_change', callback);
      };
    }
  };

  const onDeliveryLocation = (callback: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.on('delivery_location', callback);
      return () => {
        socketRef.current?.off('delivery_location', callback);
      };
    }
  };

  return {
    socket,
    isConnected,
    joinOrder,
    leaveOrder,
    onOrderUpdate,
    onStatusChange,
    onDeliveryLocation,
  };
}

