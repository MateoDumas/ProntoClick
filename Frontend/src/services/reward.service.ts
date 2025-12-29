import { api } from './api';

export interface Reward {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  type: 'coupon' | 'discount' | 'free_item' | 'free_delivery';
  discount?: number;
  discountAmount?: number;
  image?: string;
  isActive: boolean;
  stock?: number;
  redeemedCount: number;
}

export interface PointTransaction {
  id: string;
  userId: string;
  points: number;
  type: string;
  description: string;
  orderId?: string;
  rewardId?: string;
  createdAt: string;
}

export interface UserReward {
  id: string;
  userId: string;
  rewardId: string;
  couponCode?: string;
  usedAt?: string;
  redeemedAt: string;
  reward: Reward;
}

export const rewardService = {
  async getUserPoints(): Promise<{ points: number }> {
    const response = await api.get('/rewards/points');
    return response.data;
  },

  async getPointHistory(): Promise<PointTransaction[]> {
    const response = await api.get('/rewards/history');
    return response.data;
  },

  async getAvailableRewards(): Promise<Reward[]> {
    const response = await api.get('/rewards/available');
    return response.data;
  },

  async redeemReward(rewardId: string): Promise<{
    success: boolean;
    reward: {
      id: string;
      title: string;
      description: string;
      couponCode?: string;
    };
    remainingPoints: number;
  }> {
    const response = await api.post(`/rewards/redeem/${rewardId}`);
    return response.data;
  },

  async getUserRewards(): Promise<UserReward[]> {
    const response = await api.get('/rewards/my-rewards');
    return response.data;
  },
};

