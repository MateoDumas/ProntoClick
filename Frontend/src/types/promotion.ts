export type Promotion = {
  id: string;
  title: string;
  description: string;
  discount?: number | null;
  discountAmount?: number | null;
  minOrder?: number | null;
  code?: string | null;
  type: 'percentage' | 'fixed' | 'free_delivery' | 'combo';
  image?: string | null;
  restaurantId?: string | null;
  category?: string | null;
  dayOfWeek?: number | null;
  startDate?: string | null;
  endDate?: string | null;
  isActive: boolean;
  restaurant?: {
    id: string;
    name: string;
    image?: string | null;
  } | null;
};

