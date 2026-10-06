import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  durationMs?: number;
}

interface ToastStore {
  toasts: ToastItem[];
  show: (message: string, type?: ToastType, durationMs?: number) => void;
  remove: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  show: (message, type = 'info', durationMs = 3500) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    set((state) => ({
      toasts: [...state.toasts, { id, message, type, durationMs }],
    }));

    if (durationMs > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, durationMs);
    }
  },
  remove: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

export const toast = {
  success: (msg: string, duration?: number) => useToastStore.getState().show(msg, 'success', duration),
  error: (msg: string, duration?: number) => useToastStore.getState().show(msg, 'error', duration),
  info: (msg: string, duration?: number) => useToastStore.getState().show(msg, 'info', duration),
  warning: (msg: string, duration?: number) => useToastStore.getState().show(msg, 'warning', duration),
};
