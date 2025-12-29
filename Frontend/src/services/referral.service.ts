import { api } from './api';

export interface ReferralStats {
  referralCode: string;
  totalReferrals: number;
  completedReferrals: number;
  pendingReferrals: number;
  totalPointsEarned: number;
  recentReferrals: Array<{
    id: string;
    referredUserId: string;
    status: string;
    rewardPoints: number;
    completedAt?: string;
    createdAt: string;
  }>;
}

export const referralService = {
  async getCode(): Promise<{ code: string }> {
    const response = await api.get<{ code: string }>('/referrals/code');
    return response.data;
  },

  async getStats(): Promise<ReferralStats> {
    const response = await api.get<ReferralStats>('/referrals/stats');
    return response.data;
  },

  async validateCode(code: string): Promise<{ valid: boolean; referrerId?: string }> {
    const response = await api.post<{ valid: boolean; referrerId?: string }>('/referrals/validate', { code });
    return response.data;
  },
};

