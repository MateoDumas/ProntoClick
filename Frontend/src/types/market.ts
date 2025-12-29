export type MarketProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string | null;
  category?: string;
  brand?: string;
  stock?: number;
};

export type MarketCategory = {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
};

