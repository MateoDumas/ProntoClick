import { Product } from './product';

export type OrderItem = {
  product: Product;
  quantity: number;
};

export type Order = {
  id: string;
  userId: string;
  restaurantId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  tipAmount?: number | null;
  appliedPenalty?: number | null; // Penalización aplicada en este pedido
  discountAmount?: number | null;
  couponCode?: string | null;
  createdAt: string;
  updatedAt: string;
};

