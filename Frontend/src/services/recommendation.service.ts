import { api } from './api';
import { Restaurant } from '../types/restaurant';
import { Product } from '../types/product';

export interface RecommendationResponse {
  restaurants: Restaurant[];
  products: (Product & { restaurant: { id: string; name: string; image?: string } })[];
  favoriteCategories: string[];
  favoriteRestaurants: string[];
}

export const recommendationService = {
  async getRecommendations(limit?: number): Promise<RecommendationResponse> {
    const params = limit ? `?limit=${limit}` : '';
    const response = await api.get(`/recommendations${params}`);
    return response.data;
  },

  async getTrending(limit?: number): Promise<Restaurant[]> {
    const params = limit ? `?limit=${limit}` : '';
    const response = await api.get(`/recommendations/trending${params}`);
    return response.data;
  },
};

