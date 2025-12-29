import { api } from './api';
import type { Restaurant } from '../types/restaurant';
import type { Product } from '../types/product';

export interface SearchResults {
  restaurants: Restaurant[];
  products: (Product & { restaurant?: { id: string; name: string; image?: string | null } })[];
  total: number;
}

export interface SearchFilters {
  minRating?: number;
  maxDeliveryTime?: number;
  minOrder?: number;
}

export const searchAll = async (query: string): Promise<SearchResults> => {
  const { data } = await api.get<SearchResults>('/search', {
    params: { q: query },
  });
  return data;
};

export const searchRestaurants = async (
  query: string,
  filters?: SearchFilters
): Promise<Restaurant[]> => {
  const { data } = await api.get<Restaurant[]>('/search/restaurants', {
    params: {
      q: query,
      ...filters,
    },
  });
  return data;
};

export const searchProducts = async (
  query: string,
  restaurantId?: string
): Promise<Product[]> => {
  const { data } = await api.get<Product[]>('/search/products', {
    params: {
      q: query,
      restaurantId,
    },
  });
  return data;
};

