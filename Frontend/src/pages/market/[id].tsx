import type { NextPage, GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { getMarketProducts } from '../../services/market.service';
import { marketProducts } from '../../mocks/market.mock';
import type { MarketProduct } from '../../types/market';
import MarketProductCard from '../../components/market/MarketProductCard';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import { useToast } from '../../hooks/useToast';

const categoryInfo: Record<string, { name: string; icon: string; description: string }> = {
  tecnologia: {
    name: 'Tecnología',
    icon: '💻',
    description: 'Dispositivos, accesorios y más',
  },
  almacen: {
    name: 'Almacén',
    icon: '🛒',
    description: 'Productos de primera necesidad',
  },
  farmacia: {
    name: 'Farmacia',
    icon: '💊',
    description: 'Medicamentos y productos de salud',
  },
  bebidas: {
    name: 'Bebidas',
    icon: '🥤',
    description: 'Bebidas y refrescos',
  },
  limpieza: {
    name: 'Limpieza',
    icon: '🧹',
    description: 'Productos de limpieza e higiene',
  },
  mascotas: {
    name: 'Mascotas',
    icon: '🐾',
    description: 'Alimentos y accesorios para mascotas',
  },
  bebes: {
    name: 'Bebés',
    icon: '👶',
    description: 'Productos para bebés y niños',
  },
  deportes: {
    name: 'Deportes',
    icon: '⚽',
    description: 'Artículos deportivos y fitness',
  },
};

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};

const MarketCategoryPageContent: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { success } = useToast();
  const [products, setProducts] = useState<MarketProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const categoryId = typeof id === 'string' ? id : '';
  const category = categoryInfo[categoryId];

  useEffect(() => {
    if (!categoryId || !category) {
      setLoading(false);
      return;
    }

    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        // Intentar obtener del backend primero
        const backendProducts = await getMarketProducts(categoryId);
        
        if (backendProducts.length > 0) {
          if (mounted) setProducts(backendProducts);
        } else {
          // Usar datos mock si el backend no tiene productos
          const mockData = marketProducts[categoryId] || [];
          if (mounted) setProducts(mockData);
        }
      } catch (error) {
        console.error('Error loading market products:', error);
        // En caso de error, usar datos mock
        const mockData = marketProducts[categoryId] || [];
        if (mounted) setProducts(mockData);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [categoryId, category]);

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;
    const query = searchQuery.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.brand?.toLowerCase().includes(query)
    );
  }, [products, searchQuery]);

  if (!category) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Categoría no encontrada
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          La categoría que buscas no existe.
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors inline-block"
        >
          Volver al Inicio
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 relative overflow-hidden transition-colors duration-200">
      {/* Animated background blobs */}
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-red-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-red-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-red-600 via-red-500 to-red-600 dark:from-red-700 dark:via-red-600 dark:to-red-800 gradient-animated">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/80 via-red-500/80 to-red-600/80 dark:from-red-700/80 dark:via-red-600/80 dark:to-red-800/80"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center fade-in-up">
            <div className="text-6xl mb-4 transform hover:scale-110 transition-transform duration-300 inline-block">
              {category.icon}
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-2xl neon-text">
              {category.name}
            </h1>
            <p className="text-xl text-red-100 dark:text-red-200 mb-8 max-w-2xl mx-auto font-light">
              {category.description}
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto fade-in-up animation-delay-400">
              <div className="relative group">
                <input
                  type="text"
                  placeholder={`Buscar en ${category.name.toLowerCase()}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 pl-16 rounded-3xl text-lg shadow-glow-lg border-2 border-white/30 focus:ring-4 focus:ring-white focus:outline-none glass backdrop-blur-xl focus:scale-105 transition-all duration-300"
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
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Link href="/" className="hover:text-red-600 dark:hover:text-red-400 transition-colors">
            Inicio
          </Link>
          <span>/</span>
          <Link href="/" className="hover:text-red-600 dark:hover:text-red-400 transition-colors">
            Mercado
          </Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-gray-100 font-medium">{category.name}</span>
        </div>

        {/* Products Count */}
        <div className="mb-8 fade-in-up">
          <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-red-600 via-red-500 to-red-600 dark:from-red-400 dark:via-red-300 dark:to-red-400 bg-clip-text text-transparent mb-2">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'Producto' : 'Productos'} Disponibles
          </h2>
          <p className="text-gray-600 dark:text-gray-400">Encuentra lo que necesitas</p>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando productos...</p>
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
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
              {searchQuery ? 'No se encontraron productos' : 'No hay productos disponibles'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {searchQuery
                ? 'Intenta con otros términos de búsqueda'
                : 'Esta categoría aún no tiene productos disponibles.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="fade-in-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <MarketProductCard
                  product={product}
                  onAddToCart={(name) => success(`${name} agregado al carrito`)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const MarketCategoryPage: NextPage = () => {
  return (
    <ProtectedRoute>
      <MarketCategoryPageContent />
    </ProtectedRoute>
  );
};

export default MarketCategoryPage;

