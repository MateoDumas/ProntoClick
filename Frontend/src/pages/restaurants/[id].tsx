import type { NextPage, GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState, useMemo } from 'react';
import { getRestaurantById, getRestaurantProducts } from '../../services/restaurant.service';
import type { Restaurant } from '../../types/restaurant';
import type { Product } from '../../types/product';
import MenuItemCard from '../../components/restaurants/MenuItemCard';
import CategoryTabs from '../../components/restaurants/CategoryTabs';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import { useToast } from '../../hooks/useToast';
import ReviewsSection from '../../components/reviews/ReviewsSection';

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};

const RestaurantPageContent: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { success } = useToast();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Obtener categorías únicas de los productos
  const categories = useMemo(() => {
    const cats = products
      .map((p) => p.category)
      .filter((cat): cat is string => Boolean(cat));
    return Array.from(new Set(cats));
  }, [products]);

  // Filtrar productos por categoría
  const filteredProducts = useMemo(() => {
    if (activeCategory === null) return products;
    return products.filter((p) => p.category === activeCategory);
  }, [products, activeCategory]);

  useEffect(() => {
    if (!id || typeof id !== 'string') return;

    let mounted = true;
    (async () => {
      try {
        setError(null);
        const [restaurantData, productsData] = await Promise.all([
          getRestaurantById(id),
          getRestaurantProducts(id),
        ]);
        if (!mounted) return;
        
        if (!restaurantData) {
          setError('Restaurante no encontrado');
          return;
        }
        
        setRestaurant(restaurantData);
        setProducts(productsData || []);
        // Mantener activeCategory como null para mostrar todos los productos por defecto
      } catch (error: any) {
        console.error('Error loading restaurant:', error);
        if (!mounted) return;
        
        if (error?.isConnectionError || error?.code === 'ERR_NETWORK') {
          setError('No se pudo conectar con el servidor. Verifica que el backend esté corriendo en http://localhost:3001');
        } else if (error?.response?.status === 404) {
          setError('Restaurante no encontrado');
        } else {
          setError('Error al cargar el restaurante. Intenta de nuevo más tarde.');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando restaurante...</p>
        </div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {error || 'Restaurante no encontrado'}
        </h2>
        <p className="text-gray-600 mb-4">
          {error || 'El restaurante que buscas no existe o fue eliminado.'}
        </p>
        <button
          onClick={() => router.push('/restaurants')}
          className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Volver a Restaurantes
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Header del restaurante */}
      <div className="mb-8">
        {restaurant.image && (
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-64 object-cover rounded-lg mb-4"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        )}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{restaurant.name}</h1>
            <p className="text-gray-600 text-lg">{restaurant.description}</p>
          </div>
        </div>
        <div className="flex gap-6 mt-4 text-sm text-gray-600">
          {restaurant.rating && (
            <div className="flex items-center gap-1">
              <span className="text-yellow-500">⭐</span>
              <span>{restaurant.rating.toFixed(1)}</span>
            </div>
          )}
          {restaurant.deliveryTime && (
            <div>
              <span className="font-semibold">Tiempo de entrega:</span> {restaurant.deliveryTime}
            </div>
          )}
          {restaurant.minOrder && (
            <div>
              <span className="font-semibold">Pedido mínimo:</span> ${restaurant.minOrder.toFixed(2)}
            </div>
          )}
        </div>
      </div>

      {/* Menú */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Menú</h2>
        
        {categories.length > 0 && (
          <CategoryTabs
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        )}

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">
              {activeCategory
                ? `No hay productos en la categoría "${activeCategory}"`
                : 'Este restaurante aún no tiene productos disponibles.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProducts.map((product) => (
              <MenuItemCard
                key={product.id}
                product={product}
                onAddToCart={(name) => success(`${name} agregado al carrito`)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Reseñas */}
      {restaurant && (
        <div className="mt-12">
          <ReviewsSection restaurantId={restaurant.id} />
        </div>
      )}
    </>
  );
};

const RestaurantPage: NextPage = () => {
  return (
    <ProtectedRoute>
      <RestaurantPageContent />
    </ProtectedRoute>
  );
};

export default RestaurantPage;
