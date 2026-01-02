import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useCart } from '../stores/cart';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useCurrentUser } from '../hooks/useAuth';
import { createOrder, type CreateOrderDto } from '../services/order.service';
import { useToast } from '../hooks/useToast';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import CouponInput from '../components/coupons/CouponInput';

type PaymentMethod = 'card' | 'cash';

interface CardData {
  number: string;
  name: string;
  expiry: string;
  cvv: string;
}

function PaymentPageContent() {
  const router = useRouter();
  const { items, getTotal, clear } = useCart();
  const { data: user } = useCurrentUser();
  const { success, error: toastError } = useToast();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [deliveryAddress, setDeliveryAddress] = useState<any>(null);
  const [cardData, setCardData] = useState<CardData>({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Obtener dirección de localStorage
    const savedAddress = localStorage.getItem('deliveryAddress');
    if (savedAddress) {
      setDeliveryAddress(JSON.parse(savedAddress));
    } else if (items.length > 0) {
      // Solo redirigir si hay items pero no dirección
      // Evitar loop infinito
      const currentPath = router.asPath;
      if (currentPath !== '/checkout') {
        router.push('/checkout');
      }
    }

    // Verificar si hay un código de cupón pendiente de una promoción
    const pendingCoupon = localStorage.getItem('pendingCouponCode');
    const urlCoupon = router.query.coupon as string;
    if (pendingCoupon || urlCoupon) {
      const couponCode = urlCoupon || pendingCoupon;
      if (couponCode) {
        // Limpiar el código pendiente después de usarlo
        localStorage.removeItem('pendingCouponCode');
        // El código se aplicará cuando el usuario esté en la página de pago
        // y tenga items en el carrito
      }
    }
  }, [router.query]); // Ejecutar cuando cambie la query

  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [tipAmount, setTipAmount] = useState<number>(0);
  const [customTip, setCustomTip] = useState<string>('');
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<string>('');
  const [scheduledTime, setScheduledTime] = useState<string>('');
  
  const subtotal = getTotal();
  const deliveryFee = 2.99;
  const tax = subtotal * 0.1; // 10% tax
  const pendingPenalty = user?.pendingPenalty || 0;
  // El total incluye: subtotal + envío + impuestos - descuento + propina + penalización
  const total = Math.max(0, subtotal + deliveryFee + tax - couponDiscount + tipAmount + pendingPenalty);
  
  const restaurantId = items.length > 0 ? items[0].product.restaurantId : undefined;

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    }
    return v;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const validateCard = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (paymentMethod === 'card') {
      if (!cardData.number || cardData.number.replace(/\s/g, '').length < 16) {
        newErrors.cardNumber = 'Número de tarjeta inválido';
      }
      if (!cardData.name || cardData.name.length < 3) {
        newErrors.cardName = 'Nombre en la tarjeta es requerido';
      }
      if (!cardData.expiry || cardData.expiry.length < 5) {
        newErrors.cardExpiry = 'Fecha de expiración inválida';
      }
      if (!cardData.cvv || cardData.cvv.length < 3) {
        newErrors.cardCvv = 'CVV inválido';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentMethod === 'card' && !validateCard()) {
      return;
    }

    if (!deliveryAddress || items.length === 0) {
      toastError('Información incompleta. Por favor, vuelve al checkout.');
      router.push('/checkout');
      return;
    }

    // Validar que deliveryAddress tenga todos los campos requeridos
    if (!deliveryAddress.street || !deliveryAddress.city || !deliveryAddress.zipCode) {
      toastError('Por favor, completa todos los campos de la dirección.');
      router.push('/checkout');
      return;
    }

    setProcessing(true);

    try {
      const restaurantId = items[0].product.restaurantId;
      
      // Preparar fecha programada si está activada
      let scheduledFor: string | undefined = undefined;
      if (isScheduled && scheduledDate && scheduledTime) {
        const dateTime = new Date(`${scheduledDate}T${scheduledTime}`);
        if (dateTime > new Date()) {
          scheduledFor = dateTime.toISOString();
        } else {
          toastError('La fecha programada debe ser en el futuro');
          setProcessing(false);
          return;
        }
      }

      const orderData: CreateOrderDto = {
        restaurantId,
        items: items.map((item) => ({
          product: {
            id: item.product.id,
          },
          quantity: item.quantity,
          price: item.product.price, // Incluir el precio para productos de mercado
        })),
        deliveryAddress: {
          street: deliveryAddress.street,
          city: deliveryAddress.city,
          zipCode: deliveryAddress.zipCode,
          notes: deliveryAddress.notes,
        },
        paymentMethod,
        couponCode: couponCode || undefined,
        tipAmount: tipAmount > 0 ? tipAmount : undefined,
        isScheduled: isScheduled && scheduledFor ? true : undefined,
        scheduledFor,
      };

      console.log('Enviando orden:', JSON.stringify(orderData, null, 2));
      const order = await createOrder(orderData);
      
      // Limpiar localStorage y carrito
      localStorage.removeItem('deliveryAddress');
      // Guardar el ID del pedido para mostrarlo en el home
      localStorage.setItem('activeOrderId', order.id);
      clear();
      
      success('¡Pedido realizado con éxito!');
      // Redirigir al home para mostrar el seguimiento
      router.push('/');
    } catch (error: any) {
      console.error('Error creating order:', error);
      console.error('Error details:', error.response?.data);
      
      // Mostrar mensaje de error más detallado
      let errorMessage = 'Error al procesar el pedido. Intenta de nuevo.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data) {
        // Si hay errores de validación, mostrarlos
        const validationErrors = error.response.data;
        if (Array.isArray(validationErrors)) {
          errorMessage = validationErrors.map((err: any) => err.message || err).join(', ');
        } else if (typeof validationErrors === 'object') {
          errorMessage = JSON.stringify(validationErrors);
        }
      }
      
      toastError(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  if (items.length === 0) {
    router.push('/checkout');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 transition-colors duration-200">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-600 to-red-700 dark:from-red-500 dark:to-red-600 rounded-3xl mb-6 shadow-2xl transform hover:rotate-12 transition-transform">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-red-600 via-red-500 to-red-700 dark:from-red-400 dark:via-red-500 dark:to-red-600 bg-clip-text text-transparent mb-4">
            Completa tu Pago
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Último paso para recibir tu pedido
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Method Selection */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Método de Pago</h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-6 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                    paymentMethod === 'card'
                      ? 'border-red-600 dark:border-red-500 bg-red-50 dark:bg-red-900/20 shadow-lg'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">Tarjeta</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-6 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                    paymentMethod === 'cash'
                      ? 'border-red-600 dark:border-red-500 bg-red-50 dark:bg-red-900/20 shadow-lg'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
                  }`}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">Efectivo</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Card Form */}
            {paymentMethod === 'card' && (
              <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700 space-y-6 transition-colors duration-200">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Información de la Tarjeta</h2>

                <Input
                  label="Número de Tarjeta"
                  placeholder="1234 5678 9012 3456"
                  value={cardData.number}
                  onChange={(e) =>
                    setCardData({ ...cardData, number: formatCardNumber(e.target.value) })
                  }
                  maxLength={19}
                  error={errors.cardNumber}
                  required
                  autoComplete="cc-number"
                />

                <Input
                  label="Nombre en la Tarjeta"
                  placeholder="Juan Pérez"
                  value={cardData.name}
                  onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                  error={errors.cardName}
                  required
                  autoComplete="cc-name"
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Vencimiento"
                    placeholder="MM/AA"
                    value={cardData.expiry}
                    onChange={(e) =>
                      setCardData({ ...cardData, expiry: formatExpiry(e.target.value) })
                    }
                    maxLength={5}
                    error={errors.cardExpiry}
                    required
                    autoComplete="cc-exp"
                  />
                  <Input
                    label="CVV"
                    placeholder="123"
                    type="password"
                    value={cardData.cvv}
                    onChange={(e) =>
                      setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, '') })
                    }
                    maxLength={4}
                    error={errors.cardCvv}
                    required
                    autoComplete="cc-csc"
                  />
                </div>

                {/* Security Badge */}
                <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg transition-colors duration-200">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-sm text-green-700 dark:text-green-300 font-medium">
                    Pago seguro con encriptación SSL
                  </span>
                </div>

                <Button
                  type="submit"
                  className="w-full py-4 text-lg font-bold bg-gradient-to-r from-red-600 via-red-500 to-red-700 hover:from-red-700 hover:via-red-600 hover:to-red-800 shadow-xl transform hover:scale-105 transition-all"
                  disabled={processing}
                >
                  {processing ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Procesando pago...
                    </span>
                  ) : (
                    `Pagar $${total.toFixed(2)}`
                  )}
                </Button>
              </form>
            )}

            {/* Cash Payment */}
            {paymentMethod === 'cash' && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-6">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    Pago en Efectivo
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-8">
                    Pagarás cuando recibas tu pedido. El repartidor traerá el cambio necesario.
                  </p>
                  <Button
                    onClick={handleSubmit}
                    className="w-full py-4 text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-xl"
                    disabled={processing}
                  >
                    {processing ? 'Confirmando...' : `Confirmar Pedido - $${total.toFixed(2)}`}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 space-y-6">
            {/* Coupon Input */}
            <CouponInput
              orderTotal={subtotal}
              restaurantId={restaurantId}
              onCouponApplied={(discount, code) => {
                setCouponDiscount(discount);
                setCouponCode(code);
              }}
              onCouponRemoved={() => {
                setCouponDiscount(0);
                setCouponCode(null);
              }}
            />

            {/* Schedule Order Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <span>📅</span>
                Programar Pedido
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Programa tu pedido para una fecha y hora específica
              </p>
              
              <div className="flex items-center gap-3 mb-4">
                <input
                  type="checkbox"
                  id="scheduleOrder"
                  checked={isScheduled}
                  onChange={(e) => {
                    setIsScheduled(e.target.checked);
                    if (!e.target.checked) {
                      setScheduledDate('');
                      setScheduledTime('');
                    }
                  }}
                  className="w-5 h-5 text-red-600 dark:text-red-400 border-gray-300 dark:border-gray-600 rounded focus:ring-red-500 dark:focus:ring-red-400"
                />
                <label htmlFor="scheduleOrder" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                  Programar este pedido
                </label>
              </div>

              {isScheduled && (
                <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Fecha
                    </label>
                    <input
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      max={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-red-500 dark:focus:border-red-400 transition-colors"
                      required={isScheduled}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Hora
                    </label>
                    <input
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-red-500 dark:focus:border-red-400 transition-colors"
                      required={isScheduled}
                    />
                  </div>
                  {scheduledDate && scheduledTime && (
                    <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                      📌 Programado para: {new Date(`${scheduledDate}T${scheduledTime}`).toLocaleString('es-ES')}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Tip Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <span>💝</span>
                Propina para el repartidor
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Agradece a tu repartidor con una propina (opcional)
              </p>
              
              <div className="grid grid-cols-4 gap-2 mb-3">
                {[2, 5, 10, 15].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => {
                      setTipAmount(amount);
                      setCustomTip('');
                    }}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      tipAmount === amount && !customTip
                        ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    ${amount}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={customTip}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0;
                    setCustomTip(e.target.value);
                    setTipAmount(value);
                  }}
                  placeholder="Monto personalizado"
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-red-500 dark:focus:border-red-400 transition-colors"
                />
                <button
                  onClick={() => {
                    setTipAmount(0);
                    setCustomTip('');
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Sin propina
                </button>
              </div>

              {tipAmount > 0 && (
                <p className="text-sm text-green-600 dark:text-green-400 font-semibold mt-3">
                  Propina: ${tipAmount.toFixed(2)}
                </p>
              )}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700 sticky top-24 transition-colors duration-200">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">Resumen del Pedido</h2>

              {/* Items */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto custom-scrollbar">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0"
                  >
                    {item.product.image && (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Cantidad: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Envío</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Impuestos</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-sm text-green-600 dark:text-green-400 font-semibold">
                    <span>Descuento ({couponCode})</span>
                    <span>-${couponDiscount.toFixed(2)}</span>
                  </div>
                )}
                {tipAmount > 0 && (
                  <div className="flex justify-between text-sm text-green-600 dark:text-green-400 font-semibold">
                    <span>Propina 💝</span>
                    <span>${tipAmount.toFixed(2)}</span>
                  </div>
                )}
                {pendingPenalty > 0 && (
                  <div className="flex justify-between text-sm text-red-600 dark:text-red-400 font-semibold">
                    <span>Penalización por cancelación</span>
                    <span>${pendingPenalty.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-gray-100 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <span>Total</span>
                  <span className="text-2xl bg-gradient-to-r from-red-600 to-red-700 dark:from-red-400 dark:to-red-500 bg-clip-text text-transparent">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* User Info */}
              {user && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Pedido para</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{user.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <ProtectedRoute>
      <PaymentPageContent />
    </ProtectedRoute>
  );
}

