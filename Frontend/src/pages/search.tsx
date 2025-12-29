import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { searchAll, searchRestaurants, searchProducts } from '../services/search.service';
import type { Restaurant } from '../types/restaurant';
import type { Product } from '../types/product';
import RestaurantCard from '../components/restaurants/RestaurantCard';
import MarketProductCard from '../components/market/MarketProductCard';
import SearchBar from '../components/search/SearchBar';
import AdvancedFilters, { AdvancedFilters as AdvancedFiltersType } from '../components/search/AdvancedFilters';

export default function SearchPage() {
  const router = useRouter();
  const { q } = router.query;
  const searchQuery = typeof q === 'string' ? q : '';

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'restaurants' | 'products'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<AdvancedFiltersType>({});

  useEffect(() => {
    if (searchQuery) {
      performSearch();
    }
  }, [searchQuery, activeTab]);

  const performSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      if (activeTab === 'all') {
        const results = await searchAll(searchQuery);
        setRestaurants(results.restaurants);
        setProducts(results.products);
      } else if (activeTab === 'restaurants') {
        const results = await searchRestaurants(searchQuery, {
          minRating: filters.minRating,
          maxDeliveryTime: filters.maxDeliveryTime,
          minOrder: filters.minPrice,
        });
        setRestaurants(results);
        setProducts([]);
      } else {
        const results = await searchProducts(searchQuery);
        setProducts(results);
        setRestaurants([]);
      }
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery) {
      performSearch();
    }
  }, [filters]);

  const totalResults = restaurants.length + products.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-red-600 via-red-500 to-red-600 bg-clip-text text-transparent mb-4">
            Búsqueda
          </h1>
          <div className="max-w-2xl">
            <SearchBar />
          </div>
        </div>

        {/* Filters and Tabs */}
        {searchQuery && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-3 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
                activeTab === 'all'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Todo ({totalResults})
            </button>
            <button
              onClick={() => setActiveTab('restaurants')}
              className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
                activeTab === 'restaurants'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Restaurantes ({restaurants.length})
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
                activeTab === 'products'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Productos ({products.length})
              </button>
              </div>
              
              {/* Filters Button */}
              {activeTab === 'restaurants' && (
                <button
                  onClick={() => setShowFilters(true)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Filtros
                  {(filters.minRating || filters.maxDeliveryTime || filters.minPrice || filters.maxPrice) && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {[
                        filters.minRating && '⭐',
                        filters.maxDeliveryTime && '⏱️',
                        (filters.minPrice || filters.maxPrice) && '💰',
                      ].filter(Boolean).length}
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Advanced Filters Modal */}
        {showFilters && (
          <AdvancedFilters
            filters={filters}
            onFiltersChange={setFilters}
            onClose={() => setShowFilters(false)}
          />
        )}

        {/* Results */}
        {!searchQuery ? (
          <div className="text-center py-24">
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-3xl font-extrabold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent mb-3">
              Busca restaurantes y productos
            </h3>
            <p className="text-gray-600 text-lg">
              Escribe en la barra de búsqueda para encontrar lo que necesitas
            </p>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Buscando...</p>
            </div>
          </div>
        ) : totalResults === 0 ? (
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-3xl font-extrabold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent mb-3">
              No se encontraron resultados
            </h3>
            <p className="text-gray-600 text-lg">
              No hay resultados para "{searchQuery}". Intenta con otros términos.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Restaurantes */}
            {(activeTab === 'all' || activeTab === 'restaurants') && restaurants.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Restaurantes ({restaurants.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {restaurants.map((restaurant) => (
                    <RestaurantCard key={restaurant.id} r={restaurant} />
                  ))}
                </div>
              </section>
            )}

            {/* Productos */}
            {(activeTab === 'all' || activeTab === 'products') && products.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Productos ({products.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => {
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
          </div>
        )}
      </div>
    </div>
  );
}

