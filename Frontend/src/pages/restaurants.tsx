import { useState, useMemo, useEffect } from 'react';
import { Restaurant } from '../types/restaurant';
import RestaurantCard from '../components/restaurants/RestaurantCard';
import { mockRestaurants } from '../mocks/restaurants.mock';
import { getRestaurants } from '../services/restaurant.service';
import { useHoliday } from '../contexts/HolidayContext';
import ProtectedRoute from '../components/auth/ProtectedRoute';

type FilterType = 'all' | 'fast' | 'rating' | 'price';

function RestaurantsPageContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme: holidayTheme, holiday } = useHoliday();

  useEffect(() => {
    // Cargar restaurantes desde el backend
    getRestaurants()
      .then((data) => {
        if (data && data.length > 0) {
          setRestaurants(data);
        } else {
          // Si no hay datos en el backend, usar mock data como fallback
          setRestaurants(mockRestaurants);
        }
      })
      .catch(() => {
        // Usar mock data solo si el backend no está disponible
        console.warn('Backend no disponible, usando datos mock');
        setRestaurants(mockRestaurants);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredRestaurants = useMemo(() => {
    let results = [...restaurants];

    // Filtrar por búsqueda
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (r) =>
          r.name.toLowerCase().includes(query) ||
          r.description.toLowerCase().includes(query)
      );
    }

    // Filtrar por tipo
    switch (filter) {
      case 'fast':
        results = results.filter((r) => {
          const time = parseInt(r.deliveryTime?.split('-')[0] || '30');
          return time <= 25;
        });
        break;
      case 'rating':
        results = results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'price':
        results = results.sort((a, b) => (a.minOrder || 0) - (b.minOrder || 0));
        break;
    }

        return results;
  }, [searchQuery, filter, restaurants]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 relative overflow-hidden transition-colors duration-200">
      {/* Animated background blobs */}
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-red-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-red-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      
      {/* Hero Section */}
      <div className={`relative overflow-hidden bg-gradient-to-r ${holidayTheme.gradient} ${holidayTheme.darkGradient} gradient-animated`}>
        <div className={`absolute inset-0 bg-gradient-to-r ${holidayTheme.gradient} opacity-80`}></div>
        {holidayTheme.decorations && holiday !== 'none' && (
          <div className="absolute inset-0 pointer-events-none opacity-10">
            {holidayTheme.decorations.map((emoji, idx) => (
              <span
                key={idx}
                className="absolute text-5xl animate-float"
                style={{
                  left: `${(idx * 25) % 85}%`,
                  top: `${(idx * 20) % 80}%`,
                  animationDelay: `${idx * 0.6}s`,
                }}
              >
                {emoji}
              </span>
            ))}
          </div>
        )}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center fade-in-up">
            <h1 className="text-6xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-2xl neon-text flex items-center justify-center gap-3">
              <span>{holidayTheme.emoji}</span>
              <span>Descubre los Mejores
                <span className="block text-white mt-3 animate-pulse">Restaurantes</span>
              </span>
            </h1>
            {holiday !== 'none' && (
              <p className="text-xl font-semibold mb-3 text-white/90">
                ¡Celebra {holidayTheme.name} con deliciosa comida!
              </p>
            )}
            <p className="text-2xl text-white/90 mb-10 max-w-2xl mx-auto font-light">
              Más de <span className="font-bold text-white">{restaurants.length}</span> restaurantes esperando por ti. 
              Comida deliciosa entregada rápido.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto fade-in-up animation-delay-400">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Buscar restaurantes, comida, tipo de cocina..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-5 pl-16 rounded-3xl text-lg shadow-glow-lg border-2 border-white/30 focus:ring-4 focus:ring-white focus:outline-none glass backdrop-blur-xl focus:scale-105 transition-all duration-300"
                />
                <svg
                  className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400 group-hover:text-white transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Filters */}
        <div className="mb-10 flex flex-wrap items-center justify-between gap-6 fade-in-up">
          <div>
            <h2 className={`text-3xl md:text-4xl font-extrabold bg-gradient-to-r ${holidayTheme.gradient} ${holidayTheme.darkGradient} bg-clip-text text-transparent mb-2`}>
              {filteredRestaurants.length} Restaurantes Disponibles
            </h2>
            <p className="text-gray-600 dark:text-gray-400">Encuentra tu comida favorita</p>
          </div>
          
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-110 relative overflow-hidden group ${
                filter === 'all'
                  ? 'bg-gradient-to-r from-red-600 to-red-500 dark:from-red-500 dark:to-red-600 text-white shadow-glow-lg scale-105'
                  : 'glass dark:bg-gray-700/80 text-gray-700 dark:text-white hover:bg-gradient-to-r hover:from-red-50 dark:hover:from-red-900/30 hover:to-red-50 dark:hover:to-red-900/30 hover:text-red-600 dark:hover:text-red-300 shadow-md border border-white/30 dark:border-gray-600'
              }`}
            >
              <span className="relative z-10">Todos</span>
              {filter === 'all' && (
                <span className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity"></span>
              )}
            </button>
            <button
              onClick={() => setFilter('fast')}
              className={`px-6 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-110 relative overflow-hidden group ${
                filter === 'fast'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 text-white shadow-glow-lg scale-105'
                  : 'glass dark:bg-gray-700/80 text-gray-700 dark:text-white hover:bg-gradient-to-r hover:from-green-50 dark:hover:from-green-900/30 hover:to-emerald-50 dark:hover:to-emerald-900/30 hover:text-green-600 dark:hover:text-green-300 shadow-md border border-white/30 dark:border-gray-600'
              }`}
            >
              <span className="relative z-10">⚡ Rápido</span>
            </button>
            <button
              onClick={() => setFilter('rating')}
              className={`px-6 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-110 relative overflow-hidden group ${
                filter === 'rating'
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-600 dark:from-yellow-600 dark:to-orange-700 text-white shadow-glow-lg scale-105'
                  : 'glass dark:bg-gray-700/80 text-gray-700 dark:text-white hover:bg-gradient-to-r hover:from-yellow-50 dark:hover:from-yellow-900/30 hover:to-orange-50 dark:hover:to-orange-900/30 hover:text-yellow-600 dark:hover:text-yellow-300 shadow-md border border-white/30 dark:border-gray-600'
              }`}
            >
              <span className="relative z-10">⭐ Mejor Valorados</span>
            </button>
            <button
              onClick={() => setFilter('price')}
              className={`px-6 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-110 relative overflow-hidden group ${
                filter === 'price'
                  ? 'bg-gradient-to-r from-red-600 to-red-500 dark:from-red-500 dark:to-red-600 text-white shadow-glow-lg scale-105'
                  : 'glass dark:bg-gray-700/80 text-gray-700 dark:text-white hover:bg-gradient-to-r hover:from-red-50 dark:hover:from-red-900/30 hover:to-red-50 dark:hover:to-red-900/30 hover:text-red-600 dark:hover:text-red-300 shadow-md border border-white/30 dark:border-gray-600'
              }`}
            >
              <span className="relative z-10">💰 Menor Precio</span>
            </button>
          </div>
        </div>

        {/* Restaurants Grid */}
        {filteredRestaurants.length === 0 ? (
          <div className="text-center py-24 glass dark:bg-gray-800/50 rounded-3xl border-2 border-gray-200/50 dark:border-gray-700/50 p-12 fade-in-scale">
            <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-red-100 via-red-50 to-white dark:from-red-900/30 dark:via-red-800/20 dark:to-gray-800 rounded-full mb-6 morph-blob shadow-glow">
              <svg
                className="w-16 h-16 text-gray-400 dark:text-gray-500 animate-pulse"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-3xl font-extrabold bg-gradient-to-r from-red-600 to-red-500 dark:from-red-400 dark:to-red-300 bg-clip-text text-transparent mb-3">
              No se encontraron restaurantes
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Intenta con otros términos de búsqueda o filtros
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredRestaurants.map((restaurant, index) => (
              <div
                key={restaurant.id}
                className="fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <RestaurantCard r={restaurant} />
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

export default function RestaurantsPage() {
  return (
    <ProtectedRoute>
      <RestaurantsPageContent />
    </ProtectedRoute>
  );
}

