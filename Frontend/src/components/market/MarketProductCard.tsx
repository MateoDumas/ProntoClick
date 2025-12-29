import { useState } from 'react';
import type { MarketProduct } from '../../types/market';
import type { Product } from '../../types';
import Button from '../ui/Button';
import { useCart } from '../../stores/cart';
import FavoriteButton from '../favorites/FavoriteButton';

interface MarketProductCardProps {
  product: MarketProduct;
  onAddToCart?: (productName: string) => void;
}

export default function MarketProductCard({ product, onAddToCart }: MarketProductCardProps) {
  const { add } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    setJustAdded(true);
    // Convertir MarketProduct a Product para el carrito
    const cartProduct: Product = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image || null,
      restaurantId: 'market', // ID especial para productos de mercado
      category: product.category,
    };
    
    add(cartProduct, 1);
    onAddToCart?.(product.name);
    setTimeout(() => {
      setIsAdding(false);
      setTimeout(() => setJustAdded(false), 200);
    }, 400);
  };

  return (
    <div className={`glass dark:bg-gray-800/50 rounded-2xl p-5 hover-lift border border-white/30 dark:border-gray-700 group relative overflow-hidden transition-all duration-300 ${
      justAdded ? 'ring-2 ring-red-500 ring-offset-2 dark:ring-offset-gray-900 scale-[1.02]' : ''
    }`}>
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/0 to-red-500/0 group-hover:from-red-500/5 dark:group-hover:from-red-500/10 group-hover:via-red-500/5 dark:group-hover:via-red-500/10 group-hover:to-red-500/5 dark:group-hover:to-red-500/10 transition-all duration-500 rounded-2xl"></div>
      
      {/* Confetti effect cuando se agrega */}
      {justAdded && (
        <div className="absolute inset-0 pointer-events-none z-20">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 w-2 h-2 bg-red-500 rounded-full animate-ping"
              style={{
                animationDelay: `${i * 0.1}s`,
                transform: `translate(${(i % 3) * 20 - 20}px, ${Math.floor(i / 3) * 20 - 20}px)`,
              }}
            />
          ))}
        </div>
      )}
      
      <div className="flex gap-4 relative z-10">
        {product.image ? (
          <div className="relative group/image">
            <img
              src={product.image}
              alt={product.name}
              className="w-28 h-28 object-cover rounded-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-500 shadow-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl opacity-0 group-hover/image:opacity-100 transition-opacity"></div>
          </div>
        ) : (
          <div className="w-28 h-28 bg-gradient-to-br from-red-400 via-red-400 to-red-500 rounded-xl flex-shrink-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg">
            <svg
              className="w-10 h-10 text-white opacity-80"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-red-600 group-hover:to-red-500 dark:group-hover:from-red-400 dark:group-hover:to-red-300 transition-all duration-300">
              {product.name}
            </h3>
            <div className="flex items-center gap-2">
              {product.brand && (
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full whitespace-nowrap">
                  {product.brand}
                </span>
              )}
              <FavoriteButton type="product" id={product.id} />
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2 leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
            {product.description}
          </p>
          {product.stock !== undefined && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Stock: {product.stock > 10 ? (
                <span className="text-green-600 font-medium">Disponible</span>
              ) : product.stock > 0 ? (
                <span className="text-orange-600 font-medium">Últimas unidades</span>
              ) : (
                <span className="text-red-600 font-medium">Sin stock</span>
              )}
            </p>
          )}
          <div className="mt-4 flex items-center justify-between">
            <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
              ${product.price.toFixed(2)}
            </span>
            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={isAdding || (product.stock !== undefined && product.stock === 0)}
              className={`transition-all duration-300 ${
                isAdding 
                  ? 'opacity-75 scale-95' 
                  : justAdded 
                    ? 'scale-110 bg-green-500 hover:bg-green-600' 
                    : 'hover:scale-105'
              }`}
            >
              {isAdding ? (
                <span className="flex items-center gap-1">
                  <svg
                    className="animate-spin h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Agregado
                </span>
              ) : justAdded ? (
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  ¡Agregado!
                </span>
              ) : (
                'Agregar'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

