import { api } from './api';
import type { Restaurant } from '../types/restaurant';
import type { Product } from '../types/product';

export interface FavoritesResponse {
  restaurants: Restaurant[];
  products: Product[];
}

export const getFavorites = async (): Promise<FavoritesResponse> => {
  const { data } = await api.get<FavoritesResponse>('/favorites');
  return data;
};

export const addFavorite = async (
  type: 'restaurant' | 'product',
  id: string
): Promise<any> => {
  const { data } = await api.post(`/favorites/${type}/${id}`);
  return data;
};

export const removeFavorite = async (
  type: 'restaurant' | 'product',
  id: string
): Promise<{ success: boolean }> => {
  const { data } = await api.delete(`/favorites/${type}/${id}`);
  return data;
};

export const checkFavorite = async (
  type: 'restaurant' | 'product',
  id: string
): Promise<{ isFavorite: boolean }> => {
  const { data } = await api.get(`/favorites/check/${type}/${id}`);
  return data;
};

