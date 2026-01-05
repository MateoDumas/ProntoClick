import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { getReportDetails, updateReportStatus, type ReportDetails } from '../../services/support.service';
import { useToast } from '../../hooks/useToast';
import Loader from '../ui/Loader';

interface ReportDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportId: string;
  onUpdate?: () => void;
}

export default function ReportDetailsModal({
  isOpen,
  onClose,
  reportId,
  onUpdate,
}: ReportDetailsModalProps) {
  const [report, setReport] = useState<ReportDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [notes, setNotes] = useState('');
  const { success, error: toastError } = useToast();

  useEffect(() => {
    if (isOpen && reportId) {
      loadReportDetails();
    } else {
      setReport(null);
      setNotes('');
    }
  }, [isOpen, reportId]);

  const loadReportDetails = async () => {
    setLoading(true);
    try {
      const data = await getReportDetails(reportId);
      setReport(data);
      setNotes(data.notes || '');
    } catch (error: any) {
      toastError(error.response?.data?.message || 'Error al cargar los detalles del reporte');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (status: string) => {
    if (!report) return;

    setUpdating(true);
    try {
      await updateReportStatus(reportId, status, notes || undefined);
      success(`Reporte marcado como ${status === 'reviewed' ? 'revisado' : status === 'resolved' ? 'resuelto' : 'rechazado'}`);
      if (onUpdate) {
        onUpdate();
      }
      onClose();
    } catch (error: any) {
      toastError(error.response?.data?.message || 'Error al actualizar el reporte');
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300';
      case 'reviewed':
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300';
      case 'resolved':
        return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300';
      case 'rejected':
        return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'reviewed':
        return 'Revisado';
      case 'resolved':
        return 'Resuelto';
      case 'rejected':
        return 'Rechazado';
      default:
        return status;
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detalles del Reporte" size="large">
      <div className="p-6">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader text="Cargando detalles..." />
          </div>
        ) : report ? (
          <div className="space-y-6">
            {/* Información del Reporte */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Información del Reporte
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    ID: {report.id.slice(0, 8)}...
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(report.status)}`}>
                  {getStatusLabel(report.status)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Tipo</p>
                  <p className="text-sm text-gray-900 dark:text-gray-100 capitalize">{report.type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Razón</p>
                  <p className="text-sm text-gray-900 dark:text-gray-100">{report.reason}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Fecha de Creación</p>
                  <p className="text-sm text-gray-900 dark:text-gray-100">{formatDate(report.createdAt)}</p>
                </div>
                {report.fee && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Multa</p>
                    <p className="text-sm text-gray-900 dark:text-gray-100">${report.fee.toFixed(2)}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Información del Usuario */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Información del Usuario
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Nombre</p>
                  <p className="text-sm text-gray-900 dark:text-gray-100">{report.user.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</p>
                  <p className="text-sm text-gray-900 dark:text-gray-100">{report.user.email}</p>
                </div>
                {report.user.phoneNumber && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Teléfono</p>
                    <p className="text-sm text-gray-900 dark:text-gray-100">{report.user.phoneNumber}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Información del Pedido */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Información del Pedido
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Restaurante</p>
                    <p className="text-sm text-gray-900 dark:text-gray-100">{report.order.restaurant.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Estado del Pedido</p>
                    <p className="text-sm text-gray-900 dark:text-gray-100 capitalize">{report.order.status}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Total</p>
                    <p className="text-sm text-gray-900 dark:text-gray-100">${report.order.total.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Método de Pago</p>
                    <p className="text-sm text-gray-900 dark:text-gray-100 capitalize">{report.order.paymentMethod}</p>
                  </div>
                </div>

                {/* Items del Pedido */}
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Items del Pedido</p>
                  <div className="space-y-2">
                    {report.order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded"
                      >
                        <div className="flex items-center gap-3">
                          {item.product.image && (
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                          )}
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {item.product.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Cantidad: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dirección de Entrega */}
                {report.order.deliveryAddress && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Dirección de Entrega</p>
                    <div className="p-3 bg-white dark:bg-gray-700 rounded">
                      <p className="text-sm text-gray-900 dark:text-gray-100">
                        {typeof report.order.deliveryAddress === 'string'
                          ? report.order.deliveryAddress
                          : `${report.order.deliveryAddress.street || ''}, ${report.order.deliveryAddress.city || ''}, ${report.order.deliveryAddress.zipCode || ''}`}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Notas Internas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notas Internas
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                placeholder="Agrega notas internas sobre este reporte..."
              />
            </div>

            {/* Acciones */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              {report.status === 'pending' && (
                <Button
                  onClick={() => handleUpdateStatus('reviewed')}
                  disabled={updating}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Marcar como Revisado
                </Button>
              )}
              {(report.status === 'pending' || report.status === 'reviewed') && (
                <>
                  <Button
                    onClick={() => handleUpdateStatus('resolved')}
                    disabled={updating}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Marcar como Resuelto
                  </Button>
                  <Button
                    onClick={() => handleUpdateStatus('rejected')}
                    disabled={updating}
                    variant="outline"
                    className="border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    Rechazar
                  </Button>
                </>
              )}
              <Button onClick={onClose} variant="outline" className="ml-auto">
                Cerrar
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No se pudo cargar el reporte</p>
          </div>
        )}
      </div>
    </Modal>
  );
}
