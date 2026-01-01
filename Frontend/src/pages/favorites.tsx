import { useEffect, useState } from 'react';
import { getFavorites } from '../services/favorites.service';
import type { Restaurant } from '../types/restaurant';
import type { Product } from '../types/product';
import RestaurantCard from '../components/restaurants/RestaurantCard';
import MarketProductCard from '../components/market/MarketProductCard';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import { useToast } from '../hooks/useToast';
import { useHoliday } from '../contexts/HolidayContext';

function FavoritesPageContent() {
  const { theme: holidayTheme, holiday } = useHoliday();
  const { error: toastError } = useToast();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const favorites = await getFavorites();
      setRestaurants(favorites.restaurants);
      setProducts(favorites.products);
    } catch (error) {
      console.error('Error loading favorites:', error);
      toastError('Error al cargar favoritos');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 dark:border-red-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando favoritos...</p>
        </div>
      </div>
    );
  }

  const totalFavorites = restaurants.length + products.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <span className="text-4xl sm:text-5xl">{holidayTheme.emoji}</span>
            <h1 className={`text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r ${holidayTheme.gradient} ${holidayTheme.darkGradient} bg-clip-text text-transparent`}>
              Mis Favoritos
            </h1>
          </div>
          {holiday !== 'none' && (
            <p className="text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">
              ¡Favoritos especiales para {holidayTheme.name}!
            </p>
          )}
          <p className="text-gray-600 dark:text-gray-400">
            {totalFavorites === 0
              ? 'Aún no tienes favoritos'
              : `${totalFavorites} ${totalFavorites === 1 ? 'favorito' : 'favoritos'} guardados`}
          </p>
        </div>

        {totalFavorites === 0 ? (
          <div className="text-center py-12 sm:py-16 md:py-24 glass dark:bg-gray-800/50 rounded-2xl sm:rounded-3xl border-2 border-gray-200/50 dark:border-gray-700/50 p-6 sm:p-8 md:p-12 transition-colors duration-200">
            <div className="inline-flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-red-100 via-red-50 to-white dark:from-red-900/30 dark:via-red-800/20 dark:to-gray-800 rounded-full mb-4 sm:mb-6 morph-blob shadow-glow transition-colors duration-200">
              <svg
                className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 dark:text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h3 className={`text-2xl sm:text-3xl font-extrabold bg-gradient-to-r ${holidayTheme.gradient} ${holidayTheme.darkGradient} bg-clip-text text-transparent mb-3`}>
              No tienes favoritos aún
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg mb-6 max-w-md mx-auto px-4">
              Agrega restaurantes y productos a tus favoritos para encontrarlos fácilmente
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <a
                href="/restaurants"
                className="px-6 py-3 bg-red-600 dark:bg-red-500 text-white rounded-xl hover:bg-red-700 dark:hover:bg-red-600 transition-colors font-semibold text-sm sm:text-base w-full sm:w-auto text-center"
              >
                Explorar Restaurantes
              </a>
              <a
                href="/"
                className="px-6 py-3 bg-white dark:bg-gray-700 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors font-semibold border-2 border-red-600 dark:border-red-500 text-sm sm:text-base w-full sm:w-auto text-center"
              >
                Ver Mercado
              </a>
            </div>
          </div>
        ) : (
          <>
            {/* Restaurantes Favoritos */}
            {restaurants.length > 0 && (
              <section className="mb-8 sm:mb-12">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6">
                  Restaurantes Favoritos ({restaurants.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {restaurants.map((restaurant) => (
                    <RestaurantCard key={restaurant.id} r={restaurant} />
                  ))}
                </div>
              </section>
            )}

            {/* Productos Favoritos */}
            {products.length > 0 && (
              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6">
                  Productos Favoritos ({products.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {products.map((product) => {
                    // Convertir Product a MarketProduct para el componente
                    const marketProduct = {
                      id: product.id,
                      name: product.name,
                      description: product.description,
                      price: product.price,
                      image: product.image,
                      category: product.category || 'general',
                      brand: undefined,
                      stock: undefined,
                    };
                    return (
                      <MarketProductCard
                        key={product.id}
                        product={marketProduct}
                      />
                    );
                  })}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function FavoritesPage() {
  return (
    <ProtectedRoute>
      <FavoritesPageContent />
    </ProtectedRoute>
  );
}

