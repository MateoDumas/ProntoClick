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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando favoritos...</p>
        </div>
      </div>
    );
  }

  const totalFavorites = restaurants.length + products.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-5xl">{holidayTheme.emoji}</span>
            <h1 className={`text-4xl md:text-5xl font-extrabold bg-gradient-to-r ${holidayTheme.gradient} ${holidayTheme.darkGradient} bg-clip-text text-transparent`}>
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
          <div className="text-center py-24 glass rounded-3xl border-2 border-gray-200/50 p-12">
            <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-red-100 via-red-50 to-white rounded-full mb-6 morph-blob shadow-glow">
              <svg
                className="w-16 h-16 text-gray-400"
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
            <h3 className="text-3xl font-extrabold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent mb-3">
              No tienes favoritos aún
            </h3>
            <p className="text-gray-600 text-lg mb-6">
              Agrega restaurantes y productos a tus favoritos para encontrarlos fácilmente
            </p>
            <div className="flex gap-4 justify-center">
              <a
                href="/restaurants"
                className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-semibold"
              >
                Explorar Restaurantes
              </a>
              <a
                href="/"
                className="px-6 py-3 bg-white text-red-600 rounded-xl hover:bg-red-50 transition-colors font-semibold border-2 border-red-600"
              >
                Ver Mercado
              </a>
            </div>
          </div>
        ) : (
          <>
            {/* Restaurantes Favoritos */}
            {restaurants.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Restaurantes Favoritos ({restaurants.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {restaurants.map((restaurant) => (
                    <RestaurantCard key={restaurant.id} r={restaurant} />
                  ))}
                </div>
              </section>
            )}

            {/* Productos Favoritos */}
            {products.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Productos Favoritos ({products.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

