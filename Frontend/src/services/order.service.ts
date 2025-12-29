import { api } from './api';
import type { Order } from '../types/order';
import type { OrderItem } from '../types/order';

export interface CreateOrderDto {
  restaurantId: string;
  items: Array<{
    product: {
      id: string;
    };
    quantity: number;
    price?: number; // Precio del producto (necesario para productos de mercado)
  }>;
  deliveryAddress: {
    street: string;
    city: string;
    zipCode: string;
    notes?: string;
  };
  paymentMethod: 'cash' | 'card';
  couponCode?: string;
  tipAmount?: number;
  isScheduled?: boolean; // Indica si el pedido está programado
  scheduledFor?: string; // Fecha y hora programada (ISO string)
}

export const createOrder = async (orderData: CreateOrderDto): Promise<Order> => {
  const { data } = await api.post<Order>('/orders', orderData);
  return data;
};

export const getOrders = async (): Promise<Order[]> => {
  const { data } = await api.get<Order[]>('/orders');
  return data;
};

export const getOrderById = async (id: string): Promise<Order> => {
  const { data } = await api.get<Order>(`/orders/${id}`);
  return data;
};

export interface CancelOrderDto {
  reason: string;
  additionalNotes?: string;
}

export const cancelOrder = async (id: string, cancelData: CancelOrderDto): Promise<Order> => {
  const { data } = await api.post<Order>(`/orders/${id}/cancel`, cancelData);
  return data;
};

