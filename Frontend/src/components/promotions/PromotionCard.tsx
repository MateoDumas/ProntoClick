import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { Promotion } from '../../types/promotion';
import { useToast } from '../../hooks/useToast';

interface PromotionCardProps {
  promotion: Promotion;
}

export default function PromotionCard({ promotion }: PromotionCardProps) {
  const router = useRouter();
  const { success } = useToast();
  const [copied, setCopied] = useState(false);

  const getDiscountText = () => {
    if (promotion.type === 'free_delivery') {
      return 'Envío Gratis';
    }
    if (promotion.discount) {
      return `${promotion.discount}% OFF`;
    }
    if (promotion.discountAmount) {
      return `$${promotion.discountAmount} OFF`;
    }
    return 'Oferta Especial';
  };

  const getCategoryColor = () => {
    switch (promotion.category) {
      case 'restaurant':
        return 'from-orange-500 to-red-500';
      case 'market':
        return 'from-blue-500 to-cyan-500';
      default:
        return 'from-red-500 to-pink-500';
    }
  };

  const handleCopyCode = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (promotion.code) {
      navigator.clipboard.writeText(promotion.code);
      setCopied(true);
      success(`Código ${promotion.code} copiado al portapapeles`);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleApplyCoupon = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (promotion.code) {
      // Guardar el código en localStorage para usarlo en la página de pago
      localStorage.setItem('pendingCouponCode', promotion.code);
      // Redirigir a la página de restaurante o restaurantes
      if (promotion.restaurantId) {
        router.push(`/restaurants/${promotion.restaurantId}?coupon=${promotion.code}`);
      } else {
        router.push(`/restaurants?coupon=${promotion.code}`);
      }
      success(`Código ${promotion.code} listo para aplicar`);
    }
  };

  const cardContent = (
    <div className="glass rounded-3xl overflow-hidden hover-lift relative card-3d border border-white/30 h-full flex flex-col group">
      {/* Image Container */}
      <div className={`relative h-48 w-full bg-gradient-to-br ${getCategoryColor()} overflow-hidden`}>
        {promotion.image ? (
          <>
            <img
              src={promotion.image}
              alt={promotion.title}
              className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg
              className="w-20 h-20 text-white opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        )}

        {/* Discount Badge */}
        <div className="absolute top-4 right-4 glass px-4 py-2 rounded-full flex items-center gap-2 shadow-glow transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 z-10">
          <span className="text-white font-bold text-lg">{getDiscountText()}</span>
        </div>

        {/* Code Badge */}
        {promotion.code && (
          <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-red-600 dark:text-red-400 shadow-lg">
            {promotion.code}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 bg-gradient-to-b from-white/90 dark:from-gray-800/90 via-white/80 dark:via-gray-800/80 to-gray-50/90 dark:to-gray-900/90 backdrop-blur-sm flex-1 flex flex-col">
        <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100 mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-red-600 dark:group-hover:from-red-400 group-hover:to-red-500 dark:group-hover:to-red-300 transition-all duration-500">
          {promotion.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-4 leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors flex-1">
          {promotion.description}
        </p>

        {/* Action Buttons for Coupons */}
        {promotion.code && (
          <div className="flex gap-2 mb-4">
            <button
              onClick={handleCopyCode}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all text-sm flex items-center justify-center gap-2"
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copiado
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copiar código
                </>
              )}
            </button>
            <button
              onClick={handleApplyCoupon}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all text-sm flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Usar cupón
            </button>
          </div>
        )}

        {/* Info Row */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-300">
            {promotion.minOrder && (
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="font-medium">Min. ${promotion.minOrder.toFixed(2)}</span>
              </div>
            )}
            {promotion.restaurant && (
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <span className="font-medium truncate max-w-[100px]">{promotion.restaurant.name}</span>
              </div>
            )}
          </div>

          {/* Arrow Icon - Solo si no tiene código */}
          {!promotion.code && (
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 via-red-500 to-red-600 rounded-full flex items-center justify-center transform group-hover:translate-x-2 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-glow group-hover:shadow-glow-lg">
              <svg
                className="w-5 h-5 text-white transform group-hover:scale-110 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Si tiene código, no usar Link, solo mostrar el contenido
  if (promotion.code) {
    return <div className="block">{cardContent}</div>;
  }

  // Si no tiene código, usar Link normal
  return (
    <Link
      href={promotion.restaurantId ? `/restaurants/${promotion.restaurantId}` : '/promotions'}
      className="block"
    >
      {cardContent}
    </Link>
  );
}
