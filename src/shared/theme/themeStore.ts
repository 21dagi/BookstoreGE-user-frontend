import { create } from 'zustand';
import { STORAGE_KEYS } from '@/shared/constants';
import { safeStorage } from '@/shared/lib';
import { telegramAdapter } from '@/shared/telegram';
import { ThemeMode } from '@/shared/types';

interface ThemeState {
  mode: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

function resolveMode(mode: ThemeMode): 'light' | 'dark' {
  if (mode === 'light' || mode === 'dark') {
    return mode;
  }
  // Auto mode: check Telegram then matchMedia
  if (telegramAdapter.isAvailable()) {
    return telegramAdapter.getColorScheme();
  }
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

function applyThemeToDocument(theme: 'light' | 'dark') {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (theme === 'dark') {
    root.setAttribute('data-theme', 'dark');
    root.classList.add('dark');
  } else {
    root.setAttribute('data-theme', 'light');
    root.classList.remove('dark');
  }
}

const initialMode: ThemeMode =
  (safeStorage.getItem(STORAGE_KEYS.THEME) as ThemeMode) || 'auto';
const initialResolved = resolveMode(initialMode);
applyThemeToDocument(initialResolved);

export const useThemeStore = create<ThemeState>((set, get) => ({
  mode: initialMode,
  resolvedTheme: initialResolved,
  setMode: (mode: ThemeMode) => {
    const resolved = resolveMode(mode);
    safeStorage.setItem(STORAGE_KEYS.THEME, mode);
    applyThemeToDocument(resolved);
    set({ mode, resolvedTheme: resolved });
  },
  toggleTheme: () => {
    const current = get().resolvedTheme;
    const nextMode: ThemeMode = current === 'dark' ? 'light' : 'dark';
    get().setMode(nextMode);
  },
}));
