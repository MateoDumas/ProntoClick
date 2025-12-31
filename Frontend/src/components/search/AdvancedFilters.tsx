import { useState } from 'react';

export interface AdvancedFilters {
  minRating?: number;
  maxDeliveryTime?: number;
  maxPrice?: number;
  minPrice?: number;
  sortBy?: 'rating' | 'price' | 'deliveryTime' | 'name';
}

interface AdvancedFiltersProps {
  filters: AdvancedFilters;
  onFiltersChange: (filters: AdvancedFilters) => void;
  onClose: () => void;
}

export default function AdvancedFilters({ filters, onFiltersChange, onClose }: AdvancedFiltersProps) {
  const [localFilters, setLocalFilters] = useState<AdvancedFilters>(filters);

  const handleApply = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters: AdvancedFilters = {};
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Filtros Avanzados</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            {/* Rating */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Calificación mínima
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  value={localFilters.minRating || 0}
                  onChange={(e) => setLocalFilters({ ...localFilters, minRating: parseFloat(e.target.value) || undefined })}
                  className="flex-1"
                />
                <span className="text-sm font-medium text-gray-700 w-12 text-right">
                  {localFilters.minRating ? localFilters.minRating.toFixed(1) : '0'} ⭐
                </span>
              </div>
            </div>

            {/* Delivery Time */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Tiempo máximo de entrega (minutos)
              </label>
              <input
                type="number"
                min="0"
                max="120"
                value={localFilters.maxDeliveryTime || ''}
                onChange={(e) => setLocalFilters({ ...localFilters, maxDeliveryTime: parseInt(e.target.value) || undefined })}
                placeholder="Ej: 30"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Rango de precio
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Mínimo ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={localFilters.minPrice || ''}
                    onChange={(e) => setLocalFilters({ ...localFilters, minPrice: parseFloat(e.target.value) || undefined })}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Máximo ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={localFilters.maxPrice || ''}
                    onChange={(e) => setLocalFilters({ ...localFilters, maxPrice: parseFloat(e.target.value) || undefined })}
                    placeholder="Sin límite"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Ordenar por
              </label>
              <select
                value={localFilters.sortBy || 'rating'}
                onChange={(e) => setLocalFilters({ ...localFilters, sortBy: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="rating">Mejor calificación</option>
                <option value="price">Precio (menor a mayor)</option>
                <option value="deliveryTime">Tiempo de entrega</option>
                <option value="name">Nombre (A-Z)</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button
              onClick={handleReset}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Limpiar
            </button>
            <button
              onClick={handleApply}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all"
            >
              Aplicar Filtros
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

