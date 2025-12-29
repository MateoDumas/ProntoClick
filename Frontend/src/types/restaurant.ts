export type Restaurant = {
  id: string;
  name: string;
  description: string;
  image?: string | null;
  rating?: number | null;
  deliveryTime?: string | null;
  minOrder?: number | null;
};

