import { useEffect, useState } from 'react';
import { useSocket } from '../../hooks/useSocket';
import InteractiveMap from '../maps/InteractiveMap';
import GoogleMapsLoader from '../maps/GoogleMapsLoader';
import { Location } from '../../utils/maps';

interface OrderTrackingProps {
  orderId: string;
  initialStatus?: string;
  restaurantLocation?: Location;
  deliveryAddress?: {
    lat?: number;
    lng?: number;
  };
}

const statusConfig: Record<string, { label: string; color: string; darkColor: string; icon: string }> = {
  pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800', darkColor: 'dark:bg-yellow-900/30 dark:text-yellow-300', icon: '⏳' },
  confirmed: { label: 'Confirmado', color: 'bg-blue-100 text-blue-800', darkColor: 'dark:bg-blue-900/30 dark:text-blue-300', icon: '✅' },
  preparing: { label: 'En preparación', color: 'bg-orange-100 text-orange-800', darkColor: 'dark:bg-orange-900/30 dark:text-orange-300', icon: '👨‍🍳' },
  ready: { label: 'Listo', color: 'bg-purple-100 text-purple-800', darkColor: 'dark:bg-purple-900/30 dark:text-purple-300', icon: '📦' },
  on_the_way: { label: 'En camino', color: 'bg-indigo-100 text-indigo-800', darkColor: 'dark:bg-indigo-900/30 dark:text-indigo-300', icon: '🚗' },
  delivered: { label: 'Entregado', color: 'bg-green-100 text-green-800', darkColor: 'dark:bg-green-900/30 dark:text-green-300', icon: '🎉' },
  cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-800', darkColor: 'dark:bg-red-900/30 dark:text-red-300', icon: '❌' },
};

export default function OrderTracking({ orderId, initialStatus, restaurantLocation, deliveryAddress }: OrderTrackingProps) {
  const [currentStatus, setCurrentStatus] = useState(initialStatus || 'pending');
  const [deliveryLocation, setDeliveryLocation] = useState<Location | null>(null);
  const [statusHistory, setStatusHistory] = useState<Array<{ status: string; timestamp: string; message?: string }>>([]);
  
  const { isConnected, joinOrder, leaveOrder, onOrderUpdate, onStatusChange, onDeliveryLocation } = useSocket();

  // Simulación de movimiento del repartidor
  useEffect(() => {
    if (currentStatus === 'on_the_way' && restaurantLocation && deliveryAddress?.lat && deliveryAddress?.lng && !deliveryLocation) {
      // Si no hay ubicación del repartidor pero el estado es "en camino", iniciar simulación
      let progress = 0;
      const duration = 60000; // 60 segundos para llegar
      const intervalTime = 1000; // Actualizar cada segundo
      const steps = duration / intervalTime;
      const stepSize = 1 / steps;

      const interval = setInterval(() => {
        progress += stepSize;
        if (progress >= 1) {
          progress = 1;
          clearInterval(interval);
        }

        // Interpolación lineal
        const lat = restaurantLocation.lat + (deliveryAddress.lat! - restaurantLocation.lat) * progress;
        const lng = restaurantLocation.lng + (deliveryAddress.lng! - restaurantLocation.lng) * progress;

        setDeliveryLocation({ lat, lng });
      }, intervalTime);

      return () => clearInterval(interval);
    }
  }, [currentStatus, restaurantLocation, deliveryAddress, deliveryLocation]);

  useEffect(() => {
    if (isConnected) {
      joinOrder(orderId);

      const unsubscribeUpdate = onOrderUpdate((data) => {
        console.log('📦 Order update recibido:', data);
        if (data.status) {
          setCurrentStatus(data.status);
        }
      });

      const unsubscribeStatus = onStatusChange((data) => {
        console.log('🔄 Status change recibido:', data);
        // Actualizar el estado actual
        if (data.status) {
          setCurrentStatus(data.status);
        }
        // Agregar al historial solo si es un cambio nuevo
        setStatusHistory((prev) => {
          // Evitar duplicados
          const lastEntry = prev[prev.length - 1];
          if (lastEntry && lastEntry.status === data.status && lastEntry.timestamp === data.timestamp) {
            return prev;
          }
          return [
            ...prev,
            {
              status: data.status,
              timestamp: data.timestamp || new Date().toISOString(),
              message: data.message,
            },
          ];
        });
      });

      const unsubscribeLocation = onDeliveryLocation((data) => {
        setDeliveryLocation(data.location);
      });

      return () => {
        leaveOrder(orderId);
        unsubscribeUpdate?.();
        unsubscribeStatus?.();
        unsubscribeLocation?.();
      };
    }
  }, [isConnected, orderId, joinOrder, leaveOrder, onOrderUpdate, onStatusChange, onDeliveryLocation]);

  const currentStatusConfig = statusConfig[currentStatus] || statusConfig.pending;

  return (
    <div className="space-y-6">
      {/* Estado actual */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Estado del pedido</h3>
          <div className={`px-4 py-2 rounded-lg font-medium ${currentStatusConfig.color} ${currentStatusConfig.darkColor}`}>
            <span className="mr-2">{currentStatusConfig.icon}</span>
            {currentStatusConfig.label}
          </div>
        </div>

        {!isConnected && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-4 transition-colors duration-200">
            <p className="text-sm text-yellow-800 dark:text-yellow-300 flex items-center gap-2">
              <span className="w-2 h-2 bg-yellow-500 dark:bg-yellow-400 rounded-full"></span>
              No conectado. Las actualizaciones en tiempo real no están disponibles.
            </p>
            <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">
              Verifica que el backend esté corriendo en el puerto 3001. Abre la consola del navegador para más detalles.
            </p>
          </div>
        )}
        
        {isConnected && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-4 transition-colors duration-200">
            <p className="text-sm text-green-800 dark:text-green-300 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full animate-pulse"></span>
              Conectado. Recibiendo actualizaciones en tiempo real.
            </p>
          </div>
        )}

        {/* Timeline de estados */}
        <div className="space-y-3">
          {Object.entries(statusConfig).map(([status, config], index) => {
            const isActive = currentStatus === status;
            const isPast = Object.keys(statusConfig).indexOf(currentStatus) > index;
            
            return (
              <div key={status} className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isActive || isPast
                      ? `${config.color} ${config.darkColor}`
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                  }`}
                >
                  {config.icon}
                </div>
                <div className="flex-1">
                  <p
                    className={`font-medium ${
                      isActive || isPast ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500'
                    }`}
                  >
                    {config.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mapa de tracking */}
      {(currentStatus === 'on_the_way' || deliveryLocation) && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-200">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Seguimiento en tiempo real
          </h3>
          {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
            <GoogleMapsLoader>
              <InteractiveMap
                initialLocation={deliveryLocation || restaurantLocation}
                markerLabel="Repartidor"
                zoom={13}
              />
            </GoogleMapsLoader>
          ) : (
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-8 text-center transition-colors duration-200">
              <p className="text-gray-600 dark:text-gray-400">
                Para ver el mapa, configura NEXT_PUBLIC_GOOGLE_MAPS_API_KEY en tu archivo .env.local
              </p>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                <a href="/CONFIGURAR_API_KEY.md" target="_blank" className="underline hover:no-underline">
                  Ver instrucciones →
                </a>
              </p>
            </div>
          )}
          {deliveryLocation && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Última actualización: {new Date().toLocaleTimeString('es-ES')}
            </p>
          )}
        </div>
      )}

      {/* Historial de cambios */}
      {statusHistory.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-200">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Historial de actualizaciones</h3>
          <div className="space-y-3">
            {statusHistory.map((entry, index) => (
              <div key={index} className="flex items-start gap-3 pb-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
                <div className="w-2 h-2 rounded-full bg-red-500 dark:bg-red-400 mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {statusConfig[entry.status]?.label || entry.status}
                  </p>
                  {entry.message && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{entry.message}</p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {new Date(entry.timestamp).toLocaleString('es-ES')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

