import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useQueryClient } from '@tanstack/react-query';
import { getOrderById, cancelOrder } from '../../services/order.service';
import type { Order } from '../../types/order';
import OrderTracking from './OrderTracking';
import Link from 'next/link';
import { useOrderAlerts } from '../../hooks/useOrderAlerts';
import CancelOrderModal from './CancelOrderModal';
import { useToast } from '../../hooks/useToast';

interface LiveOrderTrackingProps {
  orderId: string;
  onDismiss?: () => void;
}

export default function LiveOrderTracking({ orderId, onDismiss }: LiveOrderTrackingProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const { success, error: toastError } = useToast();
  
  // Conectar a WebSocket para recibir alertas en tiempo real
  useOrderAlerts(orderId);

  useEffect(() => {
    loadOrder();
    
    // Verificar periódicamente si el pedido cambió de estado
    const interval = setInterval(() => {
      loadOrder();
    }, 10000); // Cada 10 segundos

    return () => clearInterval(interval);
  }, [orderId]);

  const loadOrder = async () => {
    try {
      const data = await getOrderById(orderId);
      setOrder(data);
      
      // Si el pedido está entregado o cancelado, limpiar el localStorage
      if (data.status === 'delivered' || data.status === 'cancelled') {
        localStorage.removeItem('activeOrderId');
      }
    } catch (error) {
      console.error('Error loading order:', error);
      // Si hay error, limpiar el localStorage
      localStorage.removeItem('activeOrderId');
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    localStorage.removeItem('activeOrderId');
    setOrder(null);
    if (onDismiss) {
      onDismiss();
    }
  };

  const handleCancelOrder = async (reason: string, additionalNotes?: string) => {
    if (!order) return;

    setCancelling(true);
    try {
      const cancelledOrder = await cancelOrder(order.id, { reason, additionalNotes });
      success('Pedido cancelado exitosamente');
      setShowCancelModal(false);
      
      // Actualizar el estado local inmediatamente para evitar que el WebSocket active sonidos
      setOrder({ ...order, status: 'cancelled' });
      
      // Invalidar el cache del usuario para refrescar pendingPenalty
      queryClient.invalidateQueries({ queryKey: ['me'] });
      
      // Recargar el pedido para obtener datos actualizados
      await loadOrder();
      
      // Limpiar localStorage y ocultar el componente
      localStorage.removeItem('activeOrderId');
      if (onDismiss) {
        onDismiss();
      }
    } catch (error: any) {
      toastError(error.response?.data?.message || 'Error al cancelar el pedido');
    } finally {
      setCancelling(false);
    }
  };

  // Estados que permiten cancelación
  const canCancel = order && ['pending', 'confirmed', 'preparing', 'ready', 'on_the_way'].includes(order.status);

  // No mostrar si el pedido está entregado o cancelado
  if (!loading && order && (order.status === 'delivered' || order.status === 'cancelled')) {
    return null;
  }

  if (loading) {
    return (
      <section className="mb-12 md:mb-16">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg transition-colors duration-200">
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 dark:border-red-400 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-300 text-sm">Cargando seguimiento...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <section className="mb-12 md:mb-16">
      <div className="bg-gradient-to-r from-red-600 to-red-700 dark:from-red-500 dark:to-red-600 rounded-2xl p-6 md:p-8 shadow-xl transition-colors duration-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 dark:bg-white/30 rounded-full flex items-center justify-center">
              <span className="text-2xl">📦</span>
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
                Sigue tu pedido en vivo
              </h2>
              <p className="text-red-100 dark:text-red-200 text-sm">
                Pedido #{order.id.slice(0, 8)}
              </p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-white/80 dark:text-white/90 hover:text-white transition-colors p-2"
            title="Ocultar seguimiento"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg transition-colors duration-200">
          <OrderTracking
            orderId={order.id}
            initialStatus={order.status}
            restaurantLocation={{ lat: -34.6037, lng: -58.3816 }} // Por ahora fijo
          />
        </div>

        <div className="mt-4 flex gap-3 flex-wrap">
          {canCancel && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="px-6 py-3 bg-red-600 dark:bg-red-500 text-white font-semibold rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-colors shadow-lg"
            >
              Cancelar Pedido
            </button>
          )}
          <Link
            href={`/orders/${order.id}`}
            className="flex-1 px-6 py-3 bg-white dark:bg-gray-700 text-red-600 dark:text-red-400 font-semibold rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-center shadow-lg"
          >
            Ver detalles completos
          </Link>
          <Link
            href="/orders"
            className="px-6 py-3 bg-white/20 dark:bg-white/30 text-white font-semibold rounded-lg hover:bg-white/30 dark:hover:bg-white/40 transition-colors border border-white/30 dark:border-white/40"
          >
            Ver todos mis pedidos
          </Link>
        </div>
      </div>

      {/* Modal de cancelación */}
      <CancelOrderModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelOrder}
        orderStatus={order?.status || ''}
        orderTotal={order?.total || 0}
        loading={cancelling}
      />
    </section>
  );
}

