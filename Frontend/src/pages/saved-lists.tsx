import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { savedListService, type SavedList } from '../services/saved-list.service';
import { useCart } from '../stores/cart';
import { useCurrentUser } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import ProtectedRoute from '../components/auth/ProtectedRoute';

function SavedListsContent() {
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const { add, clear } = useCart();
  const { success, error: toastError } = useToast();
  const queryClient = useQueryClient();

  const { data: lists, isLoading } = useQuery({
    queryKey: ['savedLists'],
    queryFn: savedListService.getAll,
    enabled: !!user,
  });

  const deleteMutation = useMutation({
    mutationFn: savedListService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedLists'] });
      success('Lista eliminada correctamente');
    },
    onError: (error: any) => {
      toastError(error.response?.data?.message || 'Error al eliminar la lista');
    },
  });

  const favoriteMutation = useMutation({
    mutationFn: savedListService.toggleFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedLists'] });
    },
  });

  const handleLoadList = (list: SavedList) => {
    if (confirm(`¿Cargar "${list.name}" al carrito? Esto reemplazará los items actuales.`)) {
      clear();
      list.items.forEach((item) => {
        add(item.product as any, item.quantity);
      });
      success(`Lista "${list.name}" cargada al carrito`);
      router.push('/checkout');
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`¿Eliminar la lista "${name}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando listas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 py-12 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">Mis Listas</h1>
          <p className="text-gray-600 dark:text-gray-400">Guarda tus carritos favoritos para pedir más rápido</p>
        </div>

        {lists && lists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lists.map((list) => {
              const totalItems = list.items.reduce((sum, item) => sum + item.quantity, 0);
              const totalPrice = list.items.reduce(
                (sum, item) => sum + item.product.price * item.quantity,
                0,
              );

              return (
                <div
                  key={list.id}
                  className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-500 transition-all shadow-lg hover:shadow-xl"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{list.name}</h3>
                          {list.isFavorite && (
                            <span className="text-yellow-500" title="Favorita">
                              ⭐
                            </span>
                          )}
                        </div>
                        {list.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">{list.description}</p>
                        )}
                      </div>
                      <button
                        onClick={() => favoriteMutation.mutate(list.id)}
                        className="text-gray-400 dark:text-gray-500 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors"
                        title={list.isFavorite ? 'Quitar de favoritos' : 'Marcar como favorita'}
                      >
                        <svg
                          className={`w-5 h-5 ${list.isFavorite ? 'fill-current' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                          />
                        </svg>
                      </button>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Items:</span>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">{totalItems}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Total:</span>
                        <span className="font-bold text-red-600 dark:text-red-400">${totalPrice.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleLoadList(list)}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 text-white rounded-lg font-semibold hover:from-red-600 hover:to-red-700 dark:hover:from-red-700 dark:hover:to-red-800 transition-all"
                      >
                        Cargar al Carrito
                      </button>
                      <button
                        onClick={() => handleDelete(list.id, list.name)}
                        className="px-4 py-2 border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 rounded-lg font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        title="Eliminar lista"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-24 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 transition-colors duration-200">
            <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-red-100 via-red-50 to-white dark:from-red-900/30 dark:via-red-800/20 dark:to-gray-800 rounded-full mb-6">
              <svg
                className="w-16 h-16 text-gray-400 dark:text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">No tienes listas guardadas</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Guarda tu carrito como lista para pedir más rápido la próxima vez
            </p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 text-white rounded-lg font-semibold hover:from-red-600 hover:to-red-700 dark:hover:from-red-700 dark:hover:to-red-800 transition-all"
            >
              Explorar Restaurantes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SavedListsPage() {
  return (
    <ProtectedRoute>
      <SavedListsContent />
    </ProtectedRoute>
  );
}

