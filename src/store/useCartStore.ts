import { create } from 'zustand';
import { CartItem, Product } from '../types';
import toast from 'react-hot-toast';

interface CartStore {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  total: 0,

  addItem: (product: Product) => {
    const items = get().items;
    const existingItem = items.find((item) => item.id === product.id);

    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        const updatedItems = items.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        set({ items: updatedItems, total: calculateTotal(updatedItems) });
        toast.success('Item quantity updated');
      } else {
        toast.error('No more stock available');
      }
    } else {
      const newItems = [...items, { ...product, quantity: 1 }];
      set({ items: newItems, total: calculateTotal(newItems) });
      toast.success('Item added to cart');
    }
  },

  removeItem: (productId: string) => {
    const items = get().items.filter((item) => item.id !== productId);
    set({ items, total: calculateTotal(items) });
    toast.success('Item removed from cart');
  },

  updateQuantity: (productId: string, quantity: number) => {
    const items = get().items.map((item) =>
      item.id === productId ? { ...item, quantity } : item
    );
    set({ items, total: calculateTotal(items) });
  },

  clearCart: () => {
    set({ items: [], total: 0 });
  },
}));

const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};