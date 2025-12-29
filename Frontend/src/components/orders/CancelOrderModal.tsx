import { useState } from 'react';
import Button from '../ui/Button';

interface CancelOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string, additionalNotes?: string) => void;
  orderStatus: string;
  orderTotal: number;
  loading?: boolean;
}

const CANCELLATION_REASONS = [
  { value: 'changed_mind', label: 'Cambié de opinión' },
  { value: 'wrong_order', label: 'Pedí algo incorrecto' },
  { value: 'duplicate_order', label: 'Pedido duplicado' },
  { value: 'delivery_time', label: 'Tiempo de entrega muy largo' },
  { value: 'found_cheaper', label: 'Encontré una mejor opción' },
  { value: 'emergency', label: 'Emergencia personal' },
  { value: 'other', label: 'Otra razón' },
];

export default function CancelOrderModal({
  isOpen,
  onClose,
  onConfirm,
  orderStatus,
  orderTotal,
  loading = false,
}: CancelOrderModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [additionalNotes, setAdditionalNotes] = useState<string>('');
  const [showFeeWarning, setShowFeeWarning] = useState(false);

  if (!isOpen) return null;

  const hasCancellationFee = orderStatus === 'on_the_way';
  const cancellationFee = hasCancellationFee ? orderTotal * 0.2 : 0;

  const handleReasonSelect = (reason: string) => {
    setSelectedReason(reason);
    if (hasCancellationFee && !showFeeWarning) {
      setShowFeeWarning(true);
    }
  };

  const handleConfirm = () => {
    if (!selectedReason) return;
    onConfirm(selectedReason, additionalNotes.trim() || undefined);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto transition-colors duration-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Cancelar Pedido</h2>
            <button
              onClick={onClose}
              className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              disabled={loading}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Alerta de costo de cancelación */}
          {hasCancellationFee && showFeeWarning && (
            <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚠️</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-1">Costo de Cancelación</h3>
                  <p className="text-sm text-yellow-800 dark:text-yellow-300 mb-2">
                    Como tu pedido ya está en camino, se aplicará un cargo de cancelación del 20% del total del pedido.
                  </p>
                  <p className="text-lg font-bold text-yellow-900 dark:text-yellow-200">
                    Costo: ${cancellationFee.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
              ¿Por qué deseas cancelar este pedido?
            </label>
            <div className="space-y-2">
              {CANCELLATION_REASONS.map((reason) => (
                <label
                  key={reason.value}
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                    selectedReason === reason.value
                      ? 'border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/30'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
                  }`}
                >
                  <input
                    type="radio"
                    name="cancellationReason"
                    value={reason.value}
                    checked={selectedReason === reason.value}
                    onChange={(e) => handleReasonSelect(e.target.value)}
                    className="w-4 h-4 text-red-600 dark:text-red-400 focus:ring-red-500 dark:focus:ring-red-400"
                    disabled={loading}
                  />
                  <span className="text-sm text-gray-900 dark:text-gray-100">{reason.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Notas adicionales (opcional)
            </label>
            <textarea
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="Cuéntanos más detalles sobre la cancelación..."
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent resize-none transition-colors"
              rows={3}
              disabled={loading}
            />
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={loading}
            >
              Volver
            </Button>
            <Button
              onClick={handleConfirm}
              className="flex-1 bg-red-600 hover:bg-red-700"
              disabled={!selectedReason || loading}
            >
              {loading ? 'Cancelando...' : 'Confirmar Cancelación'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

