import { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

interface SurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating?: number, comment?: string) => void;
  isLoading?: boolean;
  userName?: string;
  isSupportMode?: boolean; // Si es true, solo envía la encuesta sin completarla
}

export default function SurveyModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  userName,
  isSupportMode = false,
}: SurveyModalProps) {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState<number>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSupportMode) {
      // Modo soporte: solo envía la encuesta sin completarla
      onSubmit();
    } else {
      // Modo usuario: requiere rating
      if (rating === 0) {
        return;
      }
      onSubmit(rating, comment.trim() || undefined);
    }
  };

  const handleClose = () => {
    setRating(0);
    setComment('');
    setHoveredRating(0);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={isSupportMode ? "Enviar Encuesta al Usuario" : "Encuesta de Satisfacción"}>
      <form onSubmit={handleSubmit} className="space-y-8">
        {isSupportMode ? (
          <div className="py-4">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
                    ¿Deseas enviar una encuesta de satisfacción al usuario? El usuario podrá completarla y el caso se marcará como resuelto cuando la finalice.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Header con icono */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full mb-2">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {userName
                    ? `¿Cómo calificarías la atención de ${userName}?`
                    : '¿Cómo calificarías nuestra atención?'}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Tu opinión es muy importante para nosotros
                </p>
              </div>
            </div>
            
            {/* Sección de Rating con diseño mejorado */}
            <div className="space-y-6">
              {/* Estrellas con mejor diseño */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8">
                <div className="flex justify-center items-center gap-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="focus:outline-none transition-all duration-300 hover:scale-125 active:scale-95 transform group"
                      disabled={isLoading}
                      aria-label={`Calificar ${star} estrella${star > 1 ? 's' : ''}`}
                    >
                      <div className="relative">
                        <svg
                          className={`w-16 h-16 transition-all duration-300 ${
                            star <= (hoveredRating || rating)
                              ? 'text-yellow-400 fill-current drop-shadow-xl scale-110'
                              : 'text-gray-300 dark:text-gray-600 fill-current group-hover:text-yellow-200'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {star <= (hoveredRating || rating) && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-20 h-20 bg-yellow-400/20 rounded-full blur-xl animate-pulse"></div>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Texto de feedback mejorado */}
              <div className="text-center py-4">
                <div className={`inline-block px-6 py-3 rounded-full transition-all duration-300 ${
                  rating === 0
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                    : rating <= 2
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-2 border-red-200 dark:border-red-800'
                    : rating === 3
                    ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-2 border-yellow-200 dark:border-yellow-800'
                    : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-2 border-green-200 dark:border-green-800'
                }`}>
                  <p className="text-lg font-semibold">
                    {rating === 0
                      ? 'Selecciona una calificación'
                      : rating === 1
                      ? '😞 Muy insatisfecho'
                      : rating === 2
                      ? '😐 Insatisfecho'
                      : rating === 3
                      ? '😊 Neutral'
                      : rating === 4
                      ? '😄 Satisfecho'
                      : '🤩 Muy satisfecho'}
                  </p>
                </div>
              </div>
            </div>

            {/* Sección de Comentario mejorada */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <label className="block text-base font-semibold text-gray-700 dark:text-gray-300">
                  Comentario (opcional)
                </label>
              </div>
              <div className="relative">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={5}
                  className="w-full px-5 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-300 resize-none shadow-sm hover:shadow-md"
                  placeholder="Comparte tu experiencia, sugerencias o comentarios con nosotros..."
                  disabled={isLoading}
                />
                <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                  {comment.length}/500
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Tu opinión nos ayuda a mejorar nuestro servicio
              </p>
            </div>
          </div>
        )}

        {/* Botones con mejor espaciado y diseño */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-8 pb-4 px-6 border-t border-gray-200 dark:border-gray-700">
          <Button 
            type="button" 
            variant="secondary" 
            onClick={handleClose} 
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium rounded-xl"
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            isLoading={isLoading} 
            disabled={isLoading || (!isSupportMode && rating === 0)}
            className="w-full sm:w-auto px-8 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {isSupportMode ? (
              <>
                <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Enviar Encuesta al Usuario
              </>
            ) : (
              <>
                <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Enviar Encuesta
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

