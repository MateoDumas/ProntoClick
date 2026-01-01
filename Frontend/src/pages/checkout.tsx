import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useCart } from '../stores/cart';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import AddressAutocomplete from '../components/maps/AddressAutocomplete';
import InteractiveMap from '../components/maps/InteractiveMap';
import GoogleMapsLoader from '../components/maps/GoogleMapsLoader';
import { useHoliday } from '../contexts/HolidayContext';
import { Location, calculateDistance, estimateDeliveryTime, calculateDeliveryFee, formatDistance, formatDeliveryTime, getCurrentLocation } from '../utils/maps';

interface FormData {
  street: string;
  city: string;
  zipCode: string;
  notes: string;
}

interface FormErrors {
  street?: string;
  city?: string;
  zipCode?: string;
}

function CheckoutContent() {
  const router = useRouter();
  const { items, getTotal, clear } = useCart();
  const [loading, setLoading] = useState(false);
  const { theme: holidayTheme, holiday } = useHoliday();
  const [formData, setFormData] = useState<FormData>({
    street: '',
    city: '',
    zipCode: '',
    notes: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState<{
    distance: number;
    time: number;
    fee: number;
  } | null>(null);
  
  // Ubicación del restaurante (por ahora fija, luego desde la API)
  const restaurantLocation: Location = { lat: -34.6037, lng: -58.3816 };

  // Redirigir si el carrito está vacío
  useEffect(() => {
    if (items.length === 0) {
      const currentPath = router.asPath;
      if (currentPath !== '/') {
        router.push('/');
      }
    }
  }, [items.length]);

  // Detectar ubicación automáticamente
  useEffect(() => {
    getCurrentLocation()
      .then((location) => {
        setSelectedLocation(location);
      })
      .catch(() => {
        // Si falla, usar ubicación por defecto
        console.log('No se pudo obtener la ubicación');
      });
  }, []);

  // Calcular información de entrega cuando cambia la ubicación
  useEffect(() => {
    if (selectedLocation) {
      const distance = calculateDistance(restaurantLocation, selectedLocation);
      const time = estimateDeliveryTime(distance);
      const fee = calculateDeliveryFee(distance);
      setDeliveryInfo({ distance, time, fee });
    }
  }, [selectedLocation]);

  // Obtener restaurantId del primer item (todos deberían ser del mismo restaurante)
  const restaurantId = items[0]?.product.restaurantId;

  const total = getTotal();
  const subtotal = total;
  const deliveryFee = deliveryInfo?.fee || 2.99; // Fee dinámico basado en distancia
  const finalTotal = subtotal + deliveryFee;

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.street.trim()) {
      newErrors.street = 'La dirección es requerida';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'La ciudad es requerida';
    }
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'El código postal es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !restaurantId) return;

    // Guardar dirección en localStorage para usarla en payment
    localStorage.setItem('deliveryAddress', JSON.stringify({
      street: formData.street,
      city: formData.city,
      zipCode: formData.zipCode,
      notes: formData.notes || undefined,
    }));

    // Redirigir a la página de pagos
    router.push('/payment');
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  if (items.length === 0) {
    return null; // El useEffect redirigirá
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <span className="text-3xl sm:text-4xl">{holidayTheme.emoji}</span>
          <h1 className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r ${holidayTheme.gradient} ${holidayTheme.darkGradient} bg-clip-text text-transparent`}>
            Checkout
          </h1>
        </div>
        {holiday !== 'none' && (
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            ¡Finaliza tu pedido para {holidayTheme.name}!
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Formulario */}
        <div className="lg:col-span-2 order-2 lg:order-1">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Información de entrega */}
            <section className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-200">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Dirección de entrega
              </h2>
              <div className="space-y-4">
                <GoogleMapsLoader>
                  <AddressAutocomplete
                    label="Dirección"
                    value={formData.street}
                    onChange={(address, place) => {
                      handleChange('street', address);
                      if (place?.address_components) {
                        let city = formData.city;
                        let zipCode = formData.zipCode;
                        
                        place.address_components.forEach((component: { types: string[]; long_name: string }) => {
                          if (component.types.includes('locality') || component.types.includes('administrative_area_level_2')) {
                            city = component.long_name;
                          }
                          if (component.types.includes('postal_code')) {
                            zipCode = component.long_name;
                          }
                        });
                        
                        setFormData({ ...formData, street: address, city, zipCode });
                      }
                      if (place?.geometry?.location) {
                        setSelectedLocation({
                          lat: place.geometry.location.lat(),
                          lng: place.geometry.location.lng(),
                        });
                      }
                    }}
                    onLocationSelect={(location) => {
                      setSelectedLocation(location);
                    }}
                    placeholder="Buscar dirección..."
                    error={errors.street}
                  />
                </GoogleMapsLoader>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Ciudad"
                    placeholder="Ciudad"
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    error={errors.city}
                    required
                  />
                  <Input
                    label="Código Postal"
                    placeholder="12345"
                    value={formData.zipCode}
                    onChange={(e) => handleChange('zipCode', e.target.value)}
                    error={errors.zipCode}
                    required
                  />
                </div>
                
                <button
                  type="button"
                  onClick={() => setShowMap(!showMap)}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  {showMap ? 'Ocultar mapa' : '📍 Mostrar en mapa'}
                </button>
                
                {showMap && (
                  <GoogleMapsLoader>
                    <InteractiveMap
                      initialLocation={selectedLocation || undefined}
                      onLocationChange={(location) => {
                        setSelectedLocation(location);
                      }}
                      markerLabel="Dirección de entrega"
                    />
                  </GoogleMapsLoader>
                )}
                
                {deliveryInfo && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 transition-colors duration-200">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Distancia</p>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{formatDistance(deliveryInfo.distance)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Tiempo estimado</p>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{formatDeliveryTime(deliveryInfo.time)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Costo de envío</p>
                        <p className="font-semibold text-red-600 dark:text-red-400">${deliveryInfo.fee.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <Input
                  label="Notas adicionales (opcional)"
                  placeholder="Instrucciones para el repartidor"
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                />
              </div>
            </section>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={loading}
            >
              {loading ? 'Procesando...' : 'Continuar al Pago'}
            </Button>
          </form>
        </div>

        {/* Resumen del pedido */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 sticky top-24">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Resumen del pedido
            </h2>

            {/* Items */}
            <div className="space-y-3 mb-4 sm:mb-6">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex justify-between items-start pb-3 border-b border-gray-100 dark:border-gray-700"
                >
                  <div className="flex-1 min-w-0 pr-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Cantidad: {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex-shrink-0">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {/* Totales */}
            <div className="space-y-2 mb-4 sm:mb-6">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Envío</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 pt-3 border-t border-gray-200 dark:border-gray-700">
                <span>Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Info adicional */}
            <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
              {deliveryInfo ? (
                <>
                  <p>• Tiempo estimado: {formatDeliveryTime(deliveryInfo.time)}</p>
                  <p>• Distancia: {formatDistance(deliveryInfo.distance)}</p>
                </>
              ) : (
                <p>• El tiempo estimado de entrega es de 30-45 minutos</p>
              )}
              <p>• Recibirás una confirmación por correo</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Checkout() {
  return (
    <ProtectedRoute>
      <CheckoutContent />
    </ProtectedRoute>
  );
}

