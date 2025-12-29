import { api } from './api';
import type { Restaurant } from '../types/restaurant';
import type { Product } from '../types/product';

export const getRestaurants = async (): Promise<Restaurant[]> => {
  const { data } = await api.get<Restaurant[]>('/restaurants');
  return data;
};

export const getRestaurantById = async (id: string): Promise<Restaurant> => {
  const { data } = await api.get<Restaurant>(`/restaurants/${id}`);
  return data;
};

export const getRestaurantProducts = async (restaurantId: string): Promise<Product[]> => {
  const { data } = await api.get<Product[]>(`/restaurants/${restaurantId}/products`);
  return data;
};

export const getMostOrderedRestaurants = async (limit: number = 6): Promise<Restaurant[]> => {
  const { data } = await api.get<Restaurant[]>(`/restaurants/favorites?limit=${limit}`);
  return data;
};