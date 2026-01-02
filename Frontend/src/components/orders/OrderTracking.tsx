import { useEffect, useState } from 'react';
import { useSocket } from '../../hooks/useSocket';
import InteractiveMap from '../maps/InteractiveMap';
import GoogleMapsLoader from '../maps/GoogleMapsLoader';
import { Location } from '../../utils/maps';

interface OrderTrackingProps {
  orderId: string;
  initialStatus?: string;
  restaurantLocation?: Location;
}

const statusConfig: Record<string, { label: string; color: string; icon: string }> = {
  pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
  confirmed: { label: 'Confirmado', color: 'bg-blue-100 text-blue-800', icon: '✅' },
  preparing: { label: 'En preparación', color: 'bg-orange-100 text-orange-800', icon: '👨‍🍳' },
  ready: { label: 'Listo', color: 'bg-purple-100 text-purple-800', icon: '📦' },
  on_the_way: { label: 'En camino', color: 'bg-indigo-100 text-indigo-800', icon: '🚗' },
  delivered: { label: 'Entregado', color: 'bg-green-100 text-green-800', icon: '🎉' },
  cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-800', icon: '❌' },
};

export default function OrderTracking({ orderId, initialStatus, restaurantLocation }: OrderTrackingProps) {
  const [currentStatus, setCurrentStatus] = useState(initialStatus || 'pending');
  const [deliveryLocation, setDeliveryLocation] = useState<Location | null>(null);
  const [statusHistory, setStatusHistory] = useState<Array<{ status: string; timestamp: string; message?: string }>>([]);
  
  const { isConnected, joinOrder, leaveOrder, onOrderUpdate, onStatusChange, onDeliveryLocation } = useSocket();

  useEffect(() => {
    if (isConnected) {
      joinOrder(orderId);

      const unsubscribeUpdate = onOrderUpdate((data) => {
        if (data.status) {
          setCurrentStatus(data.status);
        }
      });

      const unsubscribeStatus = onStatusChange((data) => {
        setCurrentStatus(data.status);
        setStatusHistory((prev) => [
          ...prev,
          {
            status: data.status,
            timestamp: data.timestamp,
            message: data.message,
          },
        ]);
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
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Estado del pedido</h3>
          <div className={`px-4 py-2 rounded-lg font-medium ${currentStatusConfig.color}`}>
            <span className="mr-2">{currentStatusConfig.icon}</span>
            {currentStatusConfig.label}
          </div>
        </div>

        {!isConnected && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-yellow-800 flex items-center gap-2">
              <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
              No conectado. Las actualizaciones en tiempo real no están disponibles.
            </p>
            <p className="text-xs text-yellow-700 mt-1">
              Verifica que el backend esté corriendo en el puerto 3001. Abre la consola del navegador para más detalles.
            </p>
          </div>
        )}
        
        {isConnected && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-green-800 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
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
                      ? config.color
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {config.icon}
                </div>
                <div className="flex-1">
                  <p
                    className={`font-medium ${
                      isActive || isPast ? 'text-gray-900' : 'text-gray-400'
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
            <p className="text-sm text-gray-600 mt-2">
              Última actualización: {new Date().toLocaleTimeString('es-ES')}
            </p>
          )}
        </div>
      )}

      {/* Historial de cambios */}
      {statusHistory.length > 0 && (
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Historial de actualizaciones</h3>
          <div className="space-y-3">
            {statusHistory.map((entry, index) => (
              <div key={index} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                <div className="w-2 h-2 rounded-full bg-red-500 mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {statusConfig[entry.status]?.label || entry.status}
                  </p>
                  {entry.message && (
                    <p className="text-xs text-gray-600 mt-1">{entry.message}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
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

