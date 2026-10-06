import { useEffect } from 'react';
import { telegramAdapter } from './telegramAdapter';

/**
 * Hook to sync document theme with Telegram colorScheme and header styles.
 */
export function useTelegramTheme(isDark: boolean): void {
  useEffect(() => {
    const headerColor = isDark ? '#121011' : '#80182a';
    const backgroundColor = isDark ? '#121011' : '#fcfbf9';
    telegramAdapter.setHeaderColor(headerColor);
    telegramAdapter.setBackgroundColor(backgroundColor);
  }, [isDark]);
}
