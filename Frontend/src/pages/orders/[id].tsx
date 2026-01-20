import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { getOrderById } from '../../services/order.service';
import type { Order } from '../../types/order';
import { useCurrentUser } from '../../hooks/useAuth';
import Button from '../../components/ui/Button';
import OrderTracking from '../../components/orders/OrderTracking';
import ReviewForm from '../../components/reviews/ReviewForm';
import { reviewService } from '../../services/review.service';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useToast } from '../../hooks/useToast';
import { useOrderAlerts } from '../../hooks/useOrderAlerts';
import CreateReportModal from '../../components/reports/CreateReportModal';
import { createReport } from '../../services/reports.service';

const statusColors: Record<Order['status'], string> = {
  pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
  confirmed: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
  preparing: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300',
  ready: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
  delivered: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200',
  cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
};

const statusLabels: Record<Order['status'], string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  preparing: 'Preparando',
  ready: 'Listo para recoger',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

const statusSteps = [
  { key: 'pending' as const, label: 'Pedido recibido' },
  { key: 'confirmed' as const, label: 'Confirmado' },
  { key: 'preparing' as const, label: 'Preparando' },
  { key: 'ready' as const, label: 'Listo' },
  { key: 'delivered' as const, label: 'Entregado' },
];

export default function OrderDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { data: user } = useCurrentUser();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const queryClient = useQueryClient();
  const { success, error: toastError } = useToast();

  // Activar alertas de sonido y notificaciones visuales
  const orderId = typeof id === 'string' ? id : undefined;
  useOrderAlerts(orderId);

  useEffect(() => {
    if (user === null) {
      router.push('/login?returnTo=/orders');
      return;
    }

    if (id && typeof id === 'string' && user) {
      loadOrder(id);
    }
  }, [id, user, router]);

  const loadOrder = async (orderId: string) => {
    try {
      const data = await getOrderById(orderId);
      setOrder(data);
    } catch (error) {
      console.error('Error loading order:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCurrentStepIndex = () => {
    if (!order) return 0;
    return statusSteps.findIndex((step) => step.key === order.status);
  };

  const createReviewMutation = useMutation({
    mutationFn: reviewService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['userReview'] });
      setShowReviewForm(false);
      success('Reseña enviada correctamente');
    },
    onError: (error: any) => {
      toastError(error.response?.data?.message || 'Error al enviar la reseña');
    },
  });

  const createReportMutation = useMutation({
    mutationFn: (data: { type: string; reason: string; description?: string }) => {
      if (!order) throw new Error('Order not found');
      return createReport({
        orderId: order.id,
        ...data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      setShowReportModal(false);
      success('Reporte enviado correctamente. Nuestro equipo lo revisará pronto.');
    },
    onError: (error: any) => {
      toastError(error.response?.data?.message || 'Error al crear el reporte');
    },
  });

  const handleReviewSubmit = async (data: { rating: number; comment?: string }) => {
    if (!order) return;
    
    await createReviewMutation.mutateAsync({
      ...data,
      restaurantId: order.restaurantId,
      orderId: order.id,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Cargando pedido...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center transition-colors duration-200">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Pedido no encontrado</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            El pedido que buscas no existe o no tienes permiso para verlo.
          </p>
          <Link href="/orders">
            <Button>Volver a Mis Pedidos</Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/orders"
          className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-4 transition-colors"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Volver a Mis Pedidos
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Pedido #{order.id.slice(0, 8)}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Realizado el {formatDate(order.createdAt)}
            </p>
          </div>
          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold ${statusColors[order.status]}`}
          >
            {statusLabels[order.status]}
          </span>
        </div>
      </div>

      {/* Order Tracking con WebSocket */}
      <div className="mb-6">
        <OrderTracking
          orderId={order.id}
          initialStatus={order.status}
          restaurantLocation={{ lat: -34.6037, lng: -58.3816 }} // Por ahora fijo, luego desde la API
          deliveryAddress={order.deliveryAddress}
        />
      </div>

      {/* Order Items */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6 transition-colors duration-200">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Artículos del pedido</h2>
        <div className="space-y-4">
          {order.items.map((item) => (
            <div
              key={item.product.id}
              className="flex items-center gap-4 pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0"
            >
              {item.product.image && (
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">{item.product.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.product.description}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Cantidad: {item.quantity}
                </p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Resumen</h2>
        <div className="space-y-3">
          <div className="flex justify-between text-gray-600 dark:text-gray-400">
            <span>Subtotal</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
          {order.discountAmount && order.discountAmount > 0 && (
            <div className="flex justify-between text-green-600 dark:text-green-400 font-semibold">
              <span>Descuento</span>
              <span>-${order.discountAmount.toFixed(2)}</span>
            </div>
          )}
          {order.tipAmount && order.tipAmount > 0 && (
            <div className="flex justify-between text-green-600 dark:text-green-400 font-semibold">
              <span>Propina 💝</span>
              <span>${order.tipAmount.toFixed(2)}</span>
            </div>
          )}
          {order.appliedPenalty && order.appliedPenalty > 0 && (
            <div className="flex justify-between text-red-600 dark:text-red-400 font-semibold">
              <span>Penalización por cancelación</span>
              <span>${order.appliedPenalty.toFixed(2)}</span>
            </div>
          )}
          <div className="pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between">
            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Total</span>
            <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
              ${order.total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Review Form */}
      {showReviewForm && order.status === 'delivered' && (
        <div className="mt-6">
          <ReviewForm
            onSubmit={handleReviewSubmit}
            onCancel={() => setShowReviewForm(false)}
          />
        </div>
      )}

      {/* Actions */}
      {order.status === 'delivered' && !showReviewForm && (
        <div className="mt-6 flex gap-4">
          <Button className="flex-1">Pedir de nuevo</Button>
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => setShowReviewForm(true)}
          >
            Dejar reseña
          </Button>
        </div>
      )}

      {/* Report Button - Available for all orders */}
      <div className="mt-6">
        <Button
          variant="outline"
          onClick={() => setShowReportModal(true)}
          className="w-full"
        >
          🐛 Reportar Problema
        </Button>
      </div>

      {/* Create Report Modal */}
      {order && (
        <CreateReportModal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          onSubmit={(data) => createReportMutation.mutate(data)}
          orderId={order.id}
          isLoading={createReportMutation.isPending}
        />
      )}
    </div>
  );
}

