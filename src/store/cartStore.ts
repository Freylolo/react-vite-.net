import { create } from 'zustand';
import type { ProductDto } from '../types/product';

type CartItem = {
  product: ProductDto;
  cantidad: number;
};

type CartState = {
  items: CartItem[];
  addToCart: (product: ProductDto) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>((set) => ({
  items: [],
  addToCart: (product) =>
    set((state) => {
      const existing = state.items.find((i) => i.product.id === product.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.product.id === product.id ? { ...i, cantidad: i.cantidad + 1 } : i
          ),
        };
      }
      return {
        items: [...state.items, { product, cantidad: 1 }],
      };
    }),
  removeFromCart: (productId) =>
    set((state) => ({
      items: state.items.filter((i) => i.product.id !== productId),
    })),
  clearCart: () => set({ items: [] }),
}));
