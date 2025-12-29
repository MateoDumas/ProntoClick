import { api } from './api';

export interface Review {
  id: string;
  userId: string;
  restaurantId?: string;
  productId?: string;
  orderId?: string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export interface CreateReviewDto {
  restaurantId?: string;
  productId?: string;
  orderId?: string;
  rating: number;
  comment?: string;
}

export interface ReviewsResponse {
  reviews: Review[];
  averageRating: number | null;
  totalReviews: number;
}

export const reviewService = {
  async create(data: CreateReviewDto): Promise<Review> {
    const response = await api.post('/reviews', data);
    return response.data;
  },

  async getByRestaurant(restaurantId: string): Promise<ReviewsResponse> {
    const response = await api.get(`/reviews/restaurant/${restaurantId}`);
    return response.data;
  },

  async getByProduct(productId: string): Promise<ReviewsResponse> {
    const response = await api.get(`/reviews/product/${productId}`);
    return response.data;
  },

  async getUserReview(restaurantId?: string, productId?: string, orderId?: string): Promise<Review | null> {
    try {
      const params = new URLSearchParams();
      if (restaurantId) params.append('restaurantId', restaurantId);
      if (productId) params.append('productId', productId);
      if (orderId) params.append('orderId', orderId);
      
      const response = await api.get(`/reviews/user?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) return null;
      throw error;
    }
  },

  async update(reviewId: string, data: { rating?: number; comment?: string }): Promise<Review> {
    const response = await api.put(`/reviews/${reviewId}`, data);
    return response.data;
  },

  async delete(reviewId: string): Promise<void> {
    await api.delete(`/reviews/${reviewId}`);
  },
};

