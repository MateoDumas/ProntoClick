import { useState } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface CreateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { type: string; reason: string; description?: string }) => void;
  orderId: string;
  isLoading?: boolean;
}

export default function CreateReportModal({
  isOpen,
  onClose,
  onSubmit,
  orderId,
  isLoading = false,
}: CreateReportModalProps) {
  const [formData, setFormData] = useState({
    type: 'issue',
    reason: '',
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const reportTypes = [
    { value: 'issue', label: 'Problema con el pedido' },
    { value: 'refund', label: 'Solicitar reembolso' },
    { value: 'cancellation', label: 'Cancelación' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.reason.trim()) {
      newErrors.reason = 'La razón es requerida';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      type: formData.type,
      reason: formData.reason,
      description: formData.description || undefined,
    });
  };

  const handleClose = () => {
    setFormData({
      type: 'issue',
      reason: '',
      description: '',
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Reportar Problema">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tipo de reporte
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            {reportTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Razón del reporte <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            placeholder="Ej: Producto incorrecto, pedido no llegó, etc."
            error={errors.reason}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Descripción adicional (opcional)
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Proporciona más detalles sobre el problema..."
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-none"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading} className="flex-1">
            Enviar Reporte
          </Button>
        </div>
      </form>
    </Modal>
  );
}

