import { api } from './api';
import type { Promotion } from '../types/promotion';

export const getActivePromotions = async (restaurantId?: string): Promise<Promotion[]> => {
  const { data } = await api.get<Promotion[]>('/promotions', {
    params: restaurantId ? { restaurantId } : {},
  });
  return data;
};

export const getFeaturedPromotions = async (limit: number = 3): Promise<Promotion[]> => {
  const { data } = await api.get<Promotion[]>('/promotions/featured', {
    params: { limit },
  });
  return data;
};

export const getPromotionByCode = async (code: string): Promise<Promotion | null> => {
  try {
    const { data } = await api.get<Promotion>(`/promotions/code/${code}`);
    return data;
  } catch (error) {
    return null;
  }
};

