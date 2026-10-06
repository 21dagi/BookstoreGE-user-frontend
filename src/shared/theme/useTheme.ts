import { useThemeStore } from './themeStore';
import { useTelegramTheme } from '@/shared/telegram';

/**
 * Custom hook to consume and control the active theme and sync with Telegram.
 */
export function useTheme() {
  const mode = useThemeStore((s) => s.mode);
  const resolvedTheme = useThemeStore((s) => s.resolvedTheme);
  const setMode = useThemeStore((s) => s.setMode);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);

  useTelegramTheme(resolvedTheme === 'dark');

  return {
    mode,
    resolvedTheme,
    isDark: resolvedTheme === 'dark',
    setMode,
    toggleTheme,
  };
}
