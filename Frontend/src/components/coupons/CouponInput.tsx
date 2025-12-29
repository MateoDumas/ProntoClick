import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { couponService, ValidateCouponResponse } from '../../services/coupon.service';
import { useToast } from '../../hooks/useToast';

interface CouponInputProps {
  orderTotal: number;
  restaurantId?: string;
  onCouponApplied: (discount: number, couponCode: string) => void;
  onCouponRemoved: () => void;
}

export default function CouponInput({ orderTotal, restaurantId, onCouponApplied, onCouponRemoved }: CouponInputProps) {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<ValidateCouponResponse | null>(null);
  const { success, error: toastError, info } = useToast();

  // Aplicar automáticamente el cupón si viene de una promoción
  useEffect(() => {
    const pendingCoupon = localStorage.getItem('pendingCouponCode');
    const urlCoupon = router.query.coupon as string;
    const couponToApply = urlCoupon || pendingCoupon;

    if (couponToApply && !appliedCoupon && orderTotal > 0) {
      setCode(couponToApply);
      // Limpiar el código pendiente
      localStorage.removeItem('pendingCouponCode');
      // Aplicar automáticamente después de un pequeño delay
      setTimeout(() => {
        handleValidateAuto(couponToApply);
      }, 500);
    }
  }, [router.query, orderTotal]);

  const handleValidateAuto = async (couponCode: string) => {
    if (!couponCode.trim() || orderTotal === 0) return;

    setIsValidating(true);
    try {
      const result = await couponService.validate({
        code: couponCode.trim().toUpperCase(),
        orderTotal,
        restaurantId,
      });
      
      setAppliedCoupon(result);
      onCouponApplied(result.discount, result.coupon.code);
      success(`Cupón ${result.coupon.code} aplicado: ${result.coupon.description}`);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Cupón inválido';
      console.error('Error al validar cupón:', error);
      toastError(errorMessage);
      setCode('');
    } finally {
      setIsValidating(false);
    }
  };

  const handleValidate = async () => {
    if (!code.trim()) return;
    await handleValidateAuto(code);
  };

  const handleRemove = () => {
    setAppliedCoupon(null);
    setCode('');
    onCouponRemoved();
    info('Cupón removido');
  };

  if (appliedCoupon) {
    return (
      <div className="glass rounded-xl p-4 border-2 border-green-500/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-semibold">{appliedCoupon.coupon.code}</p>
            <p className="text-gray-300 text-sm">{appliedCoupon.coupon.description}</p>
            <p className="text-green-400 font-bold mt-1">
              -${appliedCoupon.discount.toFixed(2)}
            </p>
          </div>
          <button
            onClick={handleRemove}
            className="text-red-400 hover:text-red-300 transition-colors"
          >
            ✕
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-xl p-4 border border-white/20">
      <label htmlFor="coupon" className="block text-white mb-2 font-semibold">
        ¿Tienes un cupón?
      </label>
      <div className="flex gap-2">
        <input
          id="coupon"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyPress={(e) => e.key === 'Enter' && handleValidate()}
          placeholder="Código del cupón"
          className="flex-1 px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
        />
        <button
          type="button"
          onClick={handleValidate}
          disabled={!code.trim() || isValidating}
          className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isValidating ? 'Validando...' : 'Aplicar'}
        </button>
      </div>
    </div>
  );
}

