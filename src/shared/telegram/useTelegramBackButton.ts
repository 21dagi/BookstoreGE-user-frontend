import { useEffect } from 'react';
import { telegramAdapter } from './telegramAdapter';

/**
 * Hook to show Telegram native back button and bind a click callback.
 */
export function useTelegramBackButton(onClick: () => void, isVisible: boolean = true): void {
  useEffect(() => {
    const webApp = telegramAdapter.getWebApp();
    if (!webApp?.BackButton) return;

    if (isVisible) {
      webApp.BackButton.show();
      webApp.BackButton.onClick(onClick);
    } else {
      webApp.BackButton.hide();
    }

    return () => {
      webApp.BackButton.offClick(onClick);
      webApp.BackButton.hide();
    };
  }, [onClick, isVisible]);
}
