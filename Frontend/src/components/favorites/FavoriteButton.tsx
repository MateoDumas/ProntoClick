import { useState, useEffect } from 'react';
import { addFavorite, removeFavorite, checkFavorite } from '../../services/favorites.service';
import { useCurrentUser } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';

interface FavoriteButtonProps {
  type: 'restaurant' | 'product';
  id: string;
  className?: string;
}

export default function FavoriteButton({ type, id, className = '' }: FavoriteButtonProps) {
  const { data: user } = useCurrentUser();
  const { success, error: toastError } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (user) {
      checkFavorite(type, id)
        .then((response) => {
          setIsFavorite(response.isFavorite);
        })
        .catch(() => {
          setIsFavorite(false);
        })
        .finally(() => {
          setChecking(false);
        });
    } else {
      setChecking(false);
    }
  }, [user, type, id]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toastError('Debes iniciar sesión para agregar favoritos');
      return;
    }

    setLoading(true);
    try {
      if (isFavorite) {
        await removeFavorite(type, id);
        setIsFavorite(false);
        success(`${type === 'restaurant' ? 'Restaurante' : 'Producto'} eliminado de favoritos`);
      } else {
        await addFavorite(type, id);
        setIsFavorite(true);
        success(`${type === 'restaurant' ? 'Restaurante' : 'Producto'} agregado a favoritos`);
      }
    } catch (error: any) {
      console.error('Error toggling favorite:', error);
      toastError('Error al actualizar favoritos');
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <button
        className={`p-2 rounded-full bg-gray-100 ${className}`}
        disabled
      >
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading || !user}
      className={`p-2 rounded-full transition-all duration-300 transform hover:scale-110 ${
        isFavorite
          ? 'bg-red-100 text-red-600 hover:bg-red-200'
          : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-red-500'
      } ${loading ? 'opacity-50' : ''} ${className}`}
      aria-label={isFavorite ? 'Eliminar de favoritos' : 'Agregar a favoritos'}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
      ) : (
        <svg
          className="w-5 h-5"
          fill={isFavorite ? 'currentColor' : 'none'}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      )}
    </button>
  );
}

