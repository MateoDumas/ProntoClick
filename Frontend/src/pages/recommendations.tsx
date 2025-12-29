import { useQuery } from '@tanstack/react-query';
import { recommendationService } from '../services/recommendation.service';
import RestaurantCard from '../components/restaurants/RestaurantCard';
import MarketProductCard from '../components/market/MarketProductCard';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import { Restaurant } from '../types/restaurant';
import { Product } from '../types/product';

function RecommendationsPageContent() {
  const { data: recommendations, isLoading } = useQuery({
    queryKey: ['recommendations'],
    queryFn: () => recommendationService.getRecommendations(10),
  });

  const { data: trending } = useQuery({
    queryKey: ['trending'],
    queryFn: () => recommendationService.getTrending(10),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-600">Cargando recomendaciones...</div>
        </div>
      </div>
    );
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent mb-2">
              Recomendaciones para Ti
            </h1>
            <p className="text-gray-600">Basado en tu historial de pedidos</p>
          </div>

          {/* Trending Restaurants */}
          {trending && trending.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">🔥 Restaurantes Trending</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {trending.map((restaurant: Restaurant) => (
                  <RestaurantCard key={restaurant.id} r={restaurant} />
                ))}
              </div>
            </section>
          )}

          {/* Recommended Restaurants */}
          {recommendations?.restaurants && recommendations.restaurants.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">⭐ Restaurantes Recomendados</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {recommendations.restaurants.map((restaurant: Restaurant) => (
                  <RestaurantCard key={restaurant.id} r={restaurant} />
                ))}
              </div>
            </section>
          )}

          {/* Recommended Products */}
          {recommendations?.products && recommendations.products.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">🍽️ Productos Recomendados</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {recommendations.products.map((product: Product & { restaurant: { id: string; name: string; image?: string } }) => (
                  <div key={product.id} className="glass rounded-xl p-4 border border-white/20">
                    <MarketProductCard
                      product={product}
                      onAddToCart={() => {}}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {(!recommendations || (recommendations.restaurants.length === 0 && recommendations.products.length === 0)) && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg mb-4">
                Aún no tenemos suficientes datos para recomendarte
              </p>
              <p className="text-gray-500">
                ¡Haz algunos pedidos para recibir recomendaciones personalizadas!
              </p>
            </div>
          )}
        </div>
      </div>
  );
}

export default function RecommendationsPage() {
  return (
    <ProtectedRoute>
      <RecommendationsPageContent />
    </ProtectedRoute>
  );
}

