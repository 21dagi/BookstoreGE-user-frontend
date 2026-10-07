import { create } from 'zustand';
import { Book } from '@/features/catalog/types';
import { STORAGE_KEYS } from '@/shared/constants';
import { safeStorage } from '@/shared/lib';

export interface CartItem {
  book: Book;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  addItem: (book: Book, quantity?: number) => void;
  removeItem: (bookId: string) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getTotalPrice: () => number;
}

function loadCartItems(): CartItem[] {
  try {
    const raw = safeStorage.getItem(STORAGE_KEYS.CART);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch {
    // fallback to empty
  }
  return [];
}

function saveCartItems(items: CartItem[]): void {
  try {
    safeStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(items));
  } catch {
    // ignore
  }
}

export const useCartStore = create<CartState>((set, get) => ({
  items: loadCartItems(),

  addItem: (book, quantity = 1) => {
    set((state) => {
      const existingIndex = state.items.findIndex((item) => item.book.id === book.id);
      let updated: CartItem[];
      if (existingIndex >= 0) {
        updated = state.items.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updated = [...state.items, { book, quantity }];
      }
      saveCartItems(updated);
      return { items: updated };
    });
  },

  removeItem: (bookId) => {
    set((state) => {
      const updated = state.items.filter((item) => item.book.id !== bookId);
      saveCartItems(updated);
      return { items: updated };
    });
  },

  updateQuantity: (bookId, quantity) => {
    set((state) => {
      if (quantity <= 0) {
        const updated = state.items.filter((item) => item.book.id !== bookId);
        saveCartItems(updated);
        return { items: updated };
      }
      const updated = state.items.map((item) =>
        item.book.id === bookId ? { ...item, quantity } : item
      );
      saveCartItems(updated);
      return { items: updated };
    });
  },

  clearCart: () => {
    saveCartItems([]);
    set({ items: [] });
  },

  getItemCount: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },

  getTotalPrice: () => {
    return get().items.reduce((sum, item) => sum + item.book.price * item.quantity, 0);
  },
}));
