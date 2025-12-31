// Frontend/src/pages/index.tsx
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { getRestaurants, getMostOrderedRestaurants } from '../services/restaurant.service';
import type { Restaurant } from '../types/restaurant';
import RestaurantCard from '../components/restaurants/RestaurantCard';
import MarketCategories from '../components/market/MarketCategories';
import FeaturedPromotions from '../components/promotions/FeaturedPromotions';
import LiveOrderTracking from '../components/orders/LiveOrderTracking';
import { useCurrentUser } from '../hooks/useAuth';

const Home: NextPage = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [favoriteRestaurants, setFavoriteRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingFavorites, setLoadingFavorites] = useState(true);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const { data: user } = useCurrentUser();

  // Verificar si hay un pedido activo
  useEffect(() => {
    const storedOrderId = localStorage.getItem('activeOrderId');
    if (storedOrderId) {
      setActiveOrderId(storedOrderId);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getRestaurants();
        if (!mounted) return;
        setRestaurants(data);
      } catch (error) {
        console.error('Error loading restaurants:', error);
        if (!mounted) return;
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    // Solo cargar restaurantes favoritos si el usuario está autenticado
    if (!user) {
      setLoadingFavorites(false);
      return;
    }

    let mounted = true;
    (async () => {
      try {
        const data = await getMostOrderedRestaurants(6);
        if (!mounted) return;
        setFavoriteRestaurants(data);
      } catch (error) {
        console.error('Error loading favorite restaurants:', error);
        if (!mounted) return;
      } finally {
        if (mounted) setLoadingFavorites(false);
      }
    })();
    return () => { mounted = false; };
  }, [user]);

  return (
    <div className="fade-in">
      {/* Live Order Tracking - Solo si hay un pedido activo */}
      {activeOrderId && (
        <LiveOrderTracking 
          orderId={activeOrderId} 
          onDismiss={() => setActiveOrderId(null)}
        />
      )}

      {/* Hero Section */}
      <section className="mb-12 md:mb-16">
        <div className="bg-gradient-to-r from-red-600 to-red-700 dark:from-red-700 dark:to-red-800 rounded-2xl p-6 md:p-10 lg:p-12 text-white shadow-xl">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Comida deliciosa,{' '}
            <span className="text-white">entregada rápido</span>
          </h1>
          <p className="text-lg md:text-xl text-red-100 dark:text-red-200 mb-6 max-w-2xl">
            Descubre los mejores restaurantes cerca de ti y disfruta de tus platillos favoritos
            sin salir de casa.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="/restaurants" className="px-6 py-3 bg-white dark:bg-gray-800 text-red-600 dark:text-red-400 font-semibold rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-lg text-sm">
              Explorar Restaurantes
            </a>
            <a href="/promotions" className="px-6 py-3 bg-red-800 dark:bg-red-900 text-white font-semibold rounded-lg hover:bg-red-900 dark:hover:bg-red-950 transition-colors border border-red-500 dark:border-red-700 text-sm">
              Ver Promociones
            </a>
          </div>
        </div>
      </section>

      {/* Market Categories Section */}
      <div className="mb-12 md:mb-16">
        <MarketCategories />
      </div>

      {/* Featured Promotions Section */}
      <div className="mb-12 md:mb-16">
        <FeaturedPromotions />
      </div>

      {/* Favorite Restaurants Section - Solo si el usuario está autenticado y tiene restaurantes favoritos */}
      {user && favoriteRestaurants.length > 0 && (
        <section className="mb-12 md:mb-16">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">🔄</span>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                Repite tus favoritos
              </h2>
            </div>
            <p className="text-base text-gray-600 dark:text-gray-300">
              Los restaurantes que más pediste están aquí para que vuelvas a disfrutarlos
            </p>
          </div>

          {loadingFavorites ? (
            <div className="flex items-center justify-center min-h-[200px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-300 text-sm">Cargando tus favoritos...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteRestaurants.map((r) => (
                <RestaurantCard key={r.id} r={r} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Restaurants Section */}
      <section className="mb-8">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Restaurantes cerca tuyo
          </h2>
          <p className="text-base text-gray-600 dark:text-gray-300">
            Elige entre los mejores locales y disfruta de una experiencia culinaria única
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-300">Cargando restaurantes...</p>
            </div>
          </div>
        ) : restaurants.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 transition-colors duration-200">
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
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No se pudieron cargar los restaurantes
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              Verifica que el servidor backend esté corriendo.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              O intenta recargar la página más tarde.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.slice(0, Math.ceil(restaurants.length / 2)).map((r) => (
                <RestaurantCard key={r.id} r={r} />
              ))}
            </div>
            {restaurants.length > Math.ceil(restaurants.length / 2) && (
              <div className="mt-8 text-center">
                <a
                  href="/restaurants"
                  className="inline-block px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-lg transform hover:scale-105"
                >
                  Ver todos los restaurantes ({restaurants.length})
                </a>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default Home;
