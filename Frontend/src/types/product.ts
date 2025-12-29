export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string | null;
  restaurantId: string;
  category?: string;
};

