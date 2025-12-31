import { useState } from 'react';
import { CreateReviewDto } from '../../services/review.service';

interface ReviewFormProps {
  onSubmit: (data: CreateReviewDto) => Promise<void>;
  initialRating?: number;
  initialComment?: string;
  onCancel?: () => void;
}

export default function ReviewForm({ onSubmit, initialRating, initialComment, onCancel }: ReviewFormProps) {
  const [rating, setRating] = useState(initialRating || 0);
  const [comment, setComment] = useState(initialComment || '');
  const [hoveredStar, setHoveredStar] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    setIsSubmitting(true);
    try {
      await onSubmit({ rating, comment: comment.trim() || undefined });
      setRating(0);
      setComment('');
    } catch (error) {
      console.error('Error al enviar reseña:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }).map((_, i) => {
      const starValue = i + 1;
      return (
        <button
          key={i}
          type="button"
          onClick={() => setRating(starValue)}
          onMouseEnter={() => setHoveredStar(starValue)}
          onMouseLeave={() => setHoveredStar(0)}
          className="text-3xl transition-transform hover:scale-110 focus:outline-none"
        >
          <span
            className={
              starValue <= (hoveredStar || rating)
                ? 'text-yellow-400'
                : 'text-gray-400'
            }
          >
            ★
          </span>
        </button>
      );
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Deja tu reseña</h3>
      
      <div className="mb-4">
        <label className="block text-gray-900 mb-2 font-semibold">Calificación</label>
        <div className="flex gap-2">{renderStars()}</div>
        {rating > 0 && (
          <p className="text-gray-600 text-sm mt-2">
            {rating === 1 && 'Muy malo'}
            {rating === 2 && 'Malo'}
            {rating === 3 && 'Regular'}
            {rating === 4 && 'Bueno'}
            {rating === 5 && 'Excelente'}
          </p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="comment" className="block text-gray-900 mb-2 font-semibold">
          Comentario (opcional)
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-red-500 dark:focus:border-red-400 transition-colors"
          placeholder="Comparte tu experiencia..."
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={rating === 0 || isSubmitting}
          className="flex-1 bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 text-white px-6 py-2 rounded-lg font-semibold hover:from-red-600 hover:to-red-700 dark:hover:from-red-700 dark:hover:to-red-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Enviando...' : 'Enviar reseña'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

