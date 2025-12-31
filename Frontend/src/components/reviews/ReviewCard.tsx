import { Review } from '../../services/review.service';

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <span
        key={i}
        className={i < rating ? 'text-yellow-400 dark:text-yellow-500' : 'text-gray-300 dark:text-gray-600'}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-200">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-red-600 dark:from-red-500 dark:to-red-700 flex items-center justify-center text-white font-bold flex-shrink-0">
          {review.user?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100">{review.user?.name || 'Usuario'}</h4>
            <div className="flex items-center gap-1 text-sm">
              {renderStars(review.rating)}
            </div>
          </div>
          {review.comment && (
            <p className="text-gray-700 dark:text-gray-300 text-sm mt-2">{review.comment}</p>
          )}
          <p className="text-gray-500 dark:text-gray-400 text-xs mt-2">
            {new Date(review.createdAt).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>
    </div>
  );
}

