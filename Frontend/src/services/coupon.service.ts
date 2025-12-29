import { api } from './api';

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discount?: number;
  discountAmount?: number;
  minOrder?: number;
  maxDiscount?: number;
  type: 'percentage' | 'fixed' | 'free_delivery';
  restaurantId?: string;
  startDate?: string;
  endDate?: string;
  usageLimit?: number;
  userUsageLimit?: number;
  isActive: boolean;
  canUse?: boolean;
}

export interface ValidateCouponDto {
  code: string;
  orderTotal: number;
  restaurantId?: string;
}

export interface ValidateCouponResponse {
  coupon: {
    id: string;
    code: string;
    description: string;
    type: string;
  };
  discount: number;
}

export const couponService = {
  async getAvailable(): Promise<Coupon[]> {
    const response = await api.get('/coupons');
    return response.data;
  },

  async validate(data: ValidateCouponDto): Promise<ValidateCouponResponse> {
    const response = await api.post('/coupons/validate', data);
    return response.data;
  },

  async apply(couponId: string, orderId: string): Promise<void> {
    await api.post(`/coupons/${couponId}/apply`, { orderId });
  },
};

