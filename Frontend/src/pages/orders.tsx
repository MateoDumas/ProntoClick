import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { getOrders } from '../services/order.service';
import type { Order } from '../types/order';
import { useCurrentUser } from '../hooks/useAuth';
import { useHoliday } from '../contexts/HolidayContext';

const statusColors: Record<Order['status'], string> = {
  pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
  confirmed: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
  preparing: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300',
  ready: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
  delivered: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300',
  cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
};

const statusLabels: Record<Order['status'], string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  preparing: 'Preparando',
  ready: 'Listo',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

export default function Orders() {
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme: holidayTheme, holiday } = useHoliday();

  useEffect(() => {
    // Redirigir si no está autenticado
    if (user === null) {
      router.push('/login?returnTo=/orders');
      return;
    }

    // Solo cargar si el usuario está autenticado
    if (user) {
      loadOrders();
    }
  }, [user, router]);

  const loadOrders = async () => {
    try {
      const data = await getOrders();
      // Ordenar por fecha más reciente primero
      const sorted = data.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setOrders(sorted);
    } catch (error) {
      console.error('Error loading orders:', error);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 min-h-screen">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">{holidayTheme.emoji}</span>
          <h1 className={`text-3xl font-bold bg-gradient-to-r ${holidayTheme.gradient} ${holidayTheme.darkGradient} bg-clip-text text-transparent`}>
            Mis Pedidos
          </h1>
        </div>
        {holiday !== 'none' && (
          <p className="text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">
            ¡Celebra {holidayTheme.name} con tus pedidos!
          </p>
        )}
        <p className="text-gray-600 dark:text-gray-400">Historial de todos tus pedidos</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center transition-colors duration-200">
          <svg
            className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No tienes pedidos aún
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Cuando hagas tu primer pedido, aparecerá aquí
          </p>
          <Link href="/">
            <button className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
              Explorar Restaurantes
            </button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="block bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg dark:hover:shadow-xl dark:hover:shadow-black/20 transition-all hover:border-blue-300 dark:hover:border-blue-600"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Pedido #{order.id.slice(0, 8)}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status]}`}
                    >
                      {statusLabels[order.status]}
                    </span>
                  </div>

                  <div className="mb-3">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {order.items.length}{' '}
                      {order.items.length === 1 ? 'artículo' : 'artículos'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        ${order.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="ml-4">
                  <svg
                    className="w-5 h-5 text-gray-400 dark:text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

