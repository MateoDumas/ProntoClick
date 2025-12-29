import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '../../stores/cart';
import { useCurrentUser } from '../../hooks/useAuth';
import { savedListService } from '../../services/saved-list.service';
import { useToast } from '../../hooks/useToast';
import Button from '../ui/Button';

export default function CartFloating() {
  const { items, remove, clear, getTotal, getItemCount } = useCart();
  const { data: user } = useCurrentUser();
  const { success, error: toastError } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [listName, setListName] = useState('');
  const [saving, setSaving] = useState(false);

  const total = getTotal();
  const itemCount = getItemCount();

  const handleSaveList = async () => {
    if (!listName.trim()) {
      toastError('Por favor, ingresa un nombre para la lista');
      return;
    }

    if (items.length === 0) {
      toastError('El carrito está vacío');
      return;
    }

    setSaving(true);
    try {
      const listItems = items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        product: {
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          image: item.product.image,
          restaurantId: item.product.restaurantId,
        },
      }));

      await savedListService.create({
        name: listName.trim(),
        items: listItems,
      });

      success('Lista guardada correctamente');
      setListName('');
      setShowSaveDialog(false);
    } catch (error: any) {
      toastError(error.response?.data?.message || 'Error al guardar la lista');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* Botón flotante - solo se muestra si hay items */}
      {items.length > 0 && (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-white rounded-full p-5 shadow-glow-lg hover:shadow-glow-xl hover:scale-110 transition-all duration-300 z-[100] group float pulse-glow relative overflow-hidden"
        style={{ position: 'fixed' }}
        aria-label="Abrir carrito"
      >
        {/* Badge de cantidad */}
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-300 animate-pulse">
          {itemCount}
        </div>
        
        <div className="flex items-center gap-2 relative z-10">
          <svg
            className="w-7 h-7 transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
        
        {/* Shimmer effect */}
        <span className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent"></span>
      </button>
      )}

      {/* Sidebar del carrito */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-[99] backdrop-blur-sm animate-fade-in"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl z-[100] flex flex-col animate-slide-in transition-colors duration-200">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-red-50 to-white dark:from-gray-800 dark:to-gray-900 transition-colors duration-200">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Tu Carrito</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  aria-label="Cerrar carrito"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {itemCount} {itemCount === 1 ? 'artículo' : 'artículos'}
              </p>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <svg
                    className="w-16 h-16 text-gray-300 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <p className="text-gray-500 dark:text-gray-400 font-medium">Tu carrito está vacío</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                    Agrega productos para comenzar
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-500 transition-all duration-300 hover:shadow-md"
                    >
                      {item.product.image && (
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          ${item.product.price.toFixed(2)} × {item.quantity}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          ${(item.product.price * item.quantity).toFixed(2)} total
                        </p>
                      </div>
                      <button
                        onClick={() => remove(item.product.id)}
                        className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                        aria-label={`Eliminar ${item.product.name}`}
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
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 space-y-4 transition-colors duration-200">
              <div className="flex justify-between items-center text-lg">
                <span className="font-semibold text-gray-700 dark:text-gray-300">Total:</span>
                <span className="font-bold text-2xl text-red-600 dark:text-red-400">
                  ${total.toFixed(2)}
                </span>
              </div>
              <Link href="/payment" className="block">
                <Button
                  className="w-full"
                  onClick={() => setIsOpen(false)}
                >
                  Ir a Pagar
                </Button>
              </Link>
              {items.length > 0 && (
                <>
                  {user && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setShowSaveDialog(true)}
                    >
                      Guardar como Lista
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      if (confirm('¿Estás seguro de vaciar el carrito?')) {
                        clear();
                        setIsOpen(false);
                      }
                    }}
                  >
                    Vaciar Carrito
                  </Button>
                </>
              )}
            </div>
          </div>
        </>
      )}

      {/* Save List Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/50 z-[101] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Guardar Lista</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Nombre de la lista
                </label>
                <input
                  type="text"
                  value={listName}
                  onChange={(e) => setListName(e.target.value)}
                  placeholder="Ej: Lista de compras semanal"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleSaveList()}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowSaveDialog(false);
                    setListName('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveList}
                  disabled={saving || !listName.trim()}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </>
  );
}
