import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewService, ReviewsResponse } from '../../services/review.service';
import ReviewCard from './ReviewCard';
import ReviewForm from './ReviewForm';
import { useState } from 'react';
import { useToast } from '../../hooks/useToast';

interface ReviewsSectionProps {
  restaurantId?: string;
  productId?: string;
  orderId?: string;
}

export default function ReviewsSection({ restaurantId, productId, orderId }: ReviewsSectionProps) {
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();
  const { success, error: toastError } = useToast();

  const { data, isLoading } = useQuery<ReviewsResponse>({
    queryKey: ['reviews', restaurantId || productId],
    queryFn: () =>
      restaurantId
        ? reviewService.getByRestaurant(restaurantId)
        : reviewService.getByProduct(productId!),
    enabled: !!(restaurantId || productId),
  });

  const { data: userReview } = useQuery({
    queryKey: ['userReview', restaurantId, productId, orderId],
    queryFn: () => reviewService.getUserReview(restaurantId, productId, orderId),
    enabled: !!(restaurantId || productId),
  });

  const createMutation = useMutation({
    mutationFn: reviewService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['userReview'] });
      setShowForm(false);
      success('Reseña enviada correctamente');
    },
    onError: (error: any) => {
      toastError(error.response?.data?.message || 'Error al enviar la reseña');
    },
  });

  if (isLoading) {
    return <div className="text-gray-600 dark:text-gray-400">Cargando reseñas...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Reseñas</h3>
          {data && (
            <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <span className="text-yellow-400 dark:text-yellow-500 text-xl">★</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {data.averageRating?.toFixed(1) || 'N/A'}
                </span>
              </div>
              <span>•</span>
              <span>{data.totalReviews} reseñas</span>
            </div>
          )}
        </div>
        {!userReview && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 text-white px-6 py-2 rounded-lg font-semibold hover:from-red-600 hover:to-red-700 dark:hover:from-red-700 dark:hover:to-red-800 transition-all"
          >
            Escribir reseña
          </button>
        )}
      </div>

      {showForm && !userReview && (
        <ReviewForm
          onSubmit={async (data) => {
            await createMutation.mutateAsync({
              ...data,
              restaurantId,
              productId,
              orderId,
            });
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {userReview && (
        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-200 dark:border-red-800/50 transition-colors duration-200">
          <p className="text-gray-900 dark:text-gray-100 mb-2 font-semibold">Tu reseña:</p>
          <ReviewCard review={userReview} />
        </div>
      )}

      <div className="space-y-4">
        {data?.reviews.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400 text-center py-8">
            Aún no hay reseñas. ¡Sé el primero en opinar!
          </p>
        ) : (
          data?.reviews.map((review) => <ReviewCard key={review.id} review={review} />)
        )}
      </div>
    </div>
  );
}

