import { api } from './api';
import type { MarketProduct } from '../types/market';

export const getMarketProducts = async (categoryId: string): Promise<MarketProduct[]> => {
  try {
    const { data } = await api.get<MarketProduct[]>(`/market/${categoryId}/products`);
    return data;
  } catch (error) {
    // Si el backend no tiene esta ruta, retornar array vacío
    console.warn(`Market endpoint not available, using mock data for category: ${categoryId}`);
    return [];
  }
};

export const getMarketProductById = async (categoryId: string, productId: string): Promise<MarketProduct | null> => {
  try {
    const { data } = await api.get<MarketProduct>(`/market/${categoryId}/products/${productId}`);
    return data;
  } catch (error) {
    console.warn('Market product endpoint not available');
    return null;
  }
};

