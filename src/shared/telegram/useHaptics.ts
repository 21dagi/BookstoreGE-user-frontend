import { useCallback } from 'react';
import { telegramAdapter } from './telegramAdapter';

/**
 * Hook for Telegram haptic feedback interactions.
 */
export function useHaptics() {
  const impact = useCallback((style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' = 'medium') => {
    try {
      telegramAdapter.getWebApp()?.HapticFeedback?.impactOccurred(style);
    } catch {
      // Haptics unavailable
    }
  }, []);

  const notification = useCallback((type: 'error' | 'success' | 'warning') => {
    try {
      telegramAdapter.getWebApp()?.HapticFeedback?.notificationOccurred(type);
    } catch {
      // Haptics unavailable
    }
  }, []);

  const selection = useCallback(() => {
    try {
      telegramAdapter.getWebApp()?.HapticFeedback?.selectionChanged();
    } catch {
      // Haptics unavailable
    }
  }, []);

  return { impact, notification, selection };
}
