import { Reward } from '../../services/reward.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { rewardService } from '../../services/reward.service';
import { useToast } from '../../hooks/useToast';
import { useState } from 'react';

interface RewardCardProps {
  reward: Reward;
  userPoints: number;
}

export default function RewardCard({ reward, userPoints }: RewardCardProps) {
  const [isRedeeming, setIsRedeeming] = useState(false);
  const queryClient = useQueryClient();
  const { success, error: toastError } = useToast();

  const canAfford = userPoints >= reward.pointsCost;
  const isOutOfStock = reward.stock !== null && reward.stock !== undefined && reward.redeemedCount >= reward.stock;

  const redeemMutation = useMutation({
    mutationFn: rewardService.redeemReward,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['userPoints'] });
      queryClient.invalidateQueries({ queryKey: ['availableRewards'] });
      queryClient.invalidateQueries({ queryKey: ['userRewards'] });
      
      if (data.reward.couponCode) {
        success(`¡Recompensa canjeada! Tu código de cupón es: ${data.reward.couponCode}`);
      } else {
        success('¡Recompensa canjeada exitosamente!');
      }
    },
    onError: (error: any) => {
      toastError(error.response?.data?.message || 'Error al canjear la recompensa');
    },
  });

  const handleRedeem = async () => {
    if (!canAfford) {
      toastError(`Necesitas ${reward.pointsCost} puntos para canjear esta recompensa`);
      return;
    }

    if (isOutOfStock) {
      toastError('Esta recompensa se ha agotado');
      return;
    }

    if (confirm(`¿Deseas canjear "${reward.title}" por ${reward.pointsCost} puntos?`)) {
      setIsRedeeming(true);
      try {
        await redeemMutation.mutateAsync(reward.id);
      } finally {
        setIsRedeeming(false);
      }
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 border-2 transition-all ${
      canAfford && !isOutOfStock
        ? 'border-red-200 dark:border-red-700 hover:border-red-400 dark:hover:border-red-500 shadow-lg hover:shadow-xl'
        : 'border-gray-200 dark:border-gray-700 opacity-75'
    }`}>
      {reward.image && (
        <img
          src={reward.image}
          alt={reward.title}
          className="w-full h-32 object-cover rounded-lg mb-4"
        />
      )}
      
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{reward.title}</h3>
        <div className="flex items-center gap-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-3 py-1 rounded-full text-sm font-semibold">
          <span>⭐</span>
          <span>{reward.pointsCost}</span>
        </div>
      </div>

      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{reward.description}</p>

      {reward.stock !== null && reward.stock !== undefined && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          Disponibles: {reward.stock - reward.redeemedCount} de {reward.stock}
        </p>
      )}

      <button
        onClick={handleRedeem}
        disabled={!canAfford || isOutOfStock || isRedeeming}
        className={`w-full py-2 px-4 rounded-lg font-semibold transition-all ${
          canAfford && !isOutOfStock
            ? 'bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 text-white hover:from-red-600 hover:to-red-700 dark:hover:from-red-700 dark:hover:to-red-800'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
        }`}
      >
        {isRedeeming
          ? 'Canjeando...'
          : !canAfford
          ? `Necesitas ${reward.pointsCost - userPoints} puntos más`
          : isOutOfStock
          ? 'Agotado'
          : 'Canjear'}
      </button>
    </div>
  );
}

