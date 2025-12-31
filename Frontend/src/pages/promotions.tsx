import { useEffect, useState } from 'react';
import { getActivePromotions } from '../services/promotion.service';
import type { Promotion } from '../types/promotion';
import PromotionCard from '../components/promotions/PromotionCard';

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'restaurant' | 'market'>('all');

  useEffect(() => {
    loadPromotions();
  }, [filter]);

  const loadPromotions = async () => {
    try {
      setLoading(true);
      const data = await getActivePromotions();
      setPromotions(data);
    } catch (error) {
      console.error('Error loading promotions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPromotions = promotions.filter((promo) => {
    if (filter === 'all') return true;
    return promo.category === filter;
  });

  const getDayName = (dayOfWeek: number | null | undefined) => {
    if (dayOfWeek === null || dayOfWeek === undefined) return 'Todos los días';
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return days[dayOfWeek];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-200">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-red-600 via-red-500 to-red-600 dark:from-red-700 dark:via-red-600 dark:to-red-800 gradient-animated mb-12">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/80 via-red-500/80 to-red-600/80 dark:from-red-700/80 dark:via-red-600/80 dark:to-red-800/80"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center fade-in-up">
            <div className="text-6xl mb-4 transform hover:scale-110 transition-transform duration-300 inline-block">
              🎉
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-2xl neon-text">
              Promociones Especiales
            </h1>
            <p className="text-xl text-red-100 dark:text-red-200 mb-8 max-w-2xl mx-auto font-light">
              Aprovecha nuestras ofertas exclusivas que cambian cada día. ¡No te las pierdas!
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="mb-10 flex flex-wrap items-center justify-between gap-6 fade-in-up">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-red-600 via-red-500 to-red-600 dark:from-red-400 dark:via-red-300 dark:to-red-400 bg-clip-text text-transparent mb-2">
              {filteredPromotions.length} Promociones Disponibles
            </h2>
            <p className="text-gray-600 dark:text-gray-400">Ofertas que rotan diariamente</p>
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
              <span className="relative z-10">Todas</span>
            </button>
            <button
              onClick={() => setFilter('restaurant')}
              className={`px-6 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-110 relative overflow-hidden group ${
                filter === 'restaurant'
                  ? 'bg-gradient-to-r from-red-600 to-red-500 dark:from-red-500 dark:to-red-600 text-white shadow-glow-lg scale-105'
                  : 'glass dark:bg-gray-700/80 text-gray-700 dark:text-white hover:bg-gradient-to-r hover:from-red-50 dark:hover:from-red-900/30 hover:to-red-50 dark:hover:to-red-900/30 hover:text-red-600 dark:hover:text-red-300 shadow-md border border-white/30 dark:border-gray-600'
              }`}
            >
              <span className="relative z-10">🍔 Restaurantes</span>
            </button>
            <button
              onClick={() => setFilter('market')}
              className={`px-6 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-110 relative overflow-hidden group ${
                filter === 'market'
                  ? 'bg-gradient-to-r from-red-600 to-red-500 dark:from-red-500 dark:to-red-600 text-white shadow-glow-lg scale-105'
                  : 'glass dark:bg-gray-700/80 text-gray-700 dark:text-white hover:bg-gradient-to-r hover:from-red-50 dark:hover:from-red-900/30 hover:to-red-50 dark:hover:to-red-900/30 hover:text-red-600 dark:hover:text-red-300 shadow-md border border-white/30 dark:border-gray-600'
              }`}
            >
              <span className="relative z-10">🛒 Mercado</span>
            </button>
          </div>
        </div>

        {/* Promotions Grid */}
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Cargando promociones...</p>
            </div>
          </div>
        ) : filteredPromotions.length === 0 ? (
          <div className="text-center py-24 glass rounded-3xl border-2 border-gray-200/50 p-12 fade-in-scale">
            <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-red-100 via-red-50 to-white rounded-full mb-6 morph-blob shadow-glow">
              <svg
                className="w-16 h-16 text-gray-400 animate-pulse"
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
            <h3 className="text-3xl font-extrabold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent mb-3">
              No hay promociones disponibles
            </h3>
            <p className="text-gray-600 text-lg">
              {filter === 'all'
                ? 'Vuelve mañana para ver nuevas promociones'
                : `No hay promociones de ${filter === 'restaurant' ? 'restaurantes' : 'mercado'} en este momento`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPromotions.map((promotion, index) => (
              <div
                key={promotion.id}
                className="fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <PromotionCard promotion={promotion} />
              </div>
            ))}
          </div>
        )}

        {/* Info sobre rotación */}
        <div className="mt-12 glass rounded-2xl p-6 border border-white/30">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">¿Cómo funcionan las promociones?</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Nuestras promociones rotan automáticamente según el día de la semana. Cada día encontrarás ofertas
                diferentes y exclusivas. Algunas promociones aplican todos los días, mientras que otras son
                específicas de ciertos días. ¡Vuelve cada día para descubrir nuevas ofertas!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

