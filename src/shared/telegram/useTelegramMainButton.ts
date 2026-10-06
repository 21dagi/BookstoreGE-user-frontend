import { useEffect } from 'react';
import { telegramAdapter } from './telegramAdapter';

export interface TelegramMainButtonOptions {
  text: string;
  onClick: () => void;
  isVisible?: boolean;
  isEnabled?: boolean;
  isLoading?: boolean;
  color?: string;
  textColor?: string;
}

/**
 * Hook to manage Telegram native MainButton.
 */
export function useTelegramMainButton({
  text,
  onClick,
  isVisible = true,
  isEnabled = true,
  isLoading = false,
  color,
  textColor,
}: TelegramMainButtonOptions): void {
  useEffect(() => {
    const webApp = telegramAdapter.getWebApp();
    if (!webApp?.MainButton) return;

    webApp.MainButton.setText(text);
    if (color || textColor) {
      webApp.MainButton.setParams({ color, text_color: textColor });
    }

    if (isEnabled) {
      webApp.MainButton.enable();
    } else {
      webApp.MainButton.disable();
    }

    if (isLoading) {
      webApp.MainButton.showProgress(false);
    } else {
      webApp.MainButton.hideProgress();
    }

    if (isVisible) {
      webApp.MainButton.show();
      webApp.MainButton.onClick(onClick);
    } else {
      webApp.MainButton.hide();
    }

    return () => {
      webApp.MainButton.offClick(onClick);
      webApp.MainButton.hide();
    };
  }, [text, onClick, isVisible, isEnabled, isLoading, color, textColor]);
}
