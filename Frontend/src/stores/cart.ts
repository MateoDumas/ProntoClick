import { create } from 'zustand';
import { Product } from '../types';

type CartItem = { product: Product; quantity: number };

type CartState = {
  items: CartItem[];
  add: (product: Product, q?: number) => void;
  remove: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  getTotal: () => number;
  getItemCount: () => number;
};

export const useCart = create<CartState>((set, get) => ({
  items: [],
  add: (product, q = 1) => {
    set((state) => {
      const exists = state.items.find((i) => i.product.id === product.id);
      if (exists) {
        return {
          items: state.items.map((i) =>
            i.product.id === product.id
              ? { ...i, quantity: i.quantity + q }
              : i
          ),
        };
      }
      return { items: [...state.items, { product, quantity: q }] };
    });
  },
  remove: (productId) =>
    set((state) => ({
      items: state.items.filter((i) => i.product.id !== productId),
    })),
  updateQuantity: (productId, quantity) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.product.id === productId ? { ...i, quantity } : i
      ),
    })),
  clear: () => set({ items: [] }),
  getTotal: () => {
    const state = get();
    return state.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  },
  getItemCount: () => {
    const state = get();
    return state.items.reduce((sum, item) => sum + item.quantity, 0);
  },
}));
