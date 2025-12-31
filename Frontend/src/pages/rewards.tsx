import { useQuery } from '@tanstack/react-query';
import { rewardService } from '../services/reward.service';
import RewardCard from '../components/rewards/RewardCard';
import PointsDisplay from '../components/rewards/PointsDisplay';
import ReferralCard from '../components/referrals/ReferralCard';
import ProtectedRoute from '../components/auth/ProtectedRoute';

function RewardsPageContent() {
  const { data: userPoints } = useQuery({
    queryKey: ['userPoints'],
    queryFn: rewardService.getUserPoints,
  });

  const { data: rewards, isLoading } = useQuery({
    queryKey: ['availableRewards'],
    queryFn: rewardService.getAvailableRewards,
  });

  const { data: userRewards } = useQuery({
    queryKey: ['userRewards'],
    queryFn: rewardService.getUserRewards,
  });

  const { data: pointHistory } = useQuery({
    queryKey: ['pointHistory'],
    queryFn: rewardService.getPointHistory,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 py-12 transition-colors duration-200">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-red-800 dark:from-red-400 dark:to-red-300 bg-clip-text text-transparent mb-2">
              ProntoPuntos
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Gana puntos con cada compra y canjéalos por increíbles recompensas</p>
          </div>

          {/* Points Display */}
          <div className="mb-8 flex justify-center">
            <PointsDisplay />
          </div>

          {/* Referral Card */}
          <div className="mb-8">
            <ReferralCard />
          </div>

          {/* How it works */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-8 border border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-200">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">¿Cómo funciona?</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl">🛒</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Compra</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Gana 1 ProntoPunto por cada $1 gastado</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl">⭐</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Acumula</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Tus puntos se acumulan automáticamente</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl">🎁</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Canjea</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Intercambia tus puntos por recompensas</p>
              </div>
            </div>
          </div>

          {/* Available Rewards */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Recompensas Disponibles</h2>
            {isLoading ? (
              <div className="text-center py-12 text-gray-600 dark:text-gray-400">Cargando recompensas...</div>
            ) : rewards && rewards.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {rewards.map((reward) => (
                  <RewardCard
                    key={reward.id}
                    reward={reward}
                    userPoints={userPoints?.points || 0}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-600 dark:text-gray-400">
                No hay recompensas disponibles en este momento
              </div>
            )}
          </div>

          {/* My Rewards */}
          {userRewards && userRewards.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Mis Recompensas Canjeadas</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {userRewards.map((userReward) => (
                  <div
                    key={userReward.id}
                    className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-200"
                  >
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{userReward.reward.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{userReward.reward.description}</p>
                    {userReward.couponCode && (
                      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mt-3">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Código de cupón:</p>
                        <p className="font-mono font-bold text-red-600 dark:text-red-400">{userReward.couponCode}</p>
                      </div>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Canjeado: {new Date(userReward.redeemedAt).toLocaleDateString('es-ES')}
                    </p>
                    {userReward.usedAt && (
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">✓ Usado</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Point History */}
          {pointHistory && pointHistory.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Historial de Puntos</h2>
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden transition-colors duration-200">
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {pointHistory.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{transaction.description}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(transaction.createdAt).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <div
                        className={`font-bold ${
                          transaction.points > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        }`}
                      >
                        {transaction.points > 0 ? '+' : ''}
                        {transaction.points} puntos
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
  );
}

export default function RewardsPage() {
  return (
    <ProtectedRoute>
      <RewardsPageContent />
    </ProtectedRoute>
  );
}

