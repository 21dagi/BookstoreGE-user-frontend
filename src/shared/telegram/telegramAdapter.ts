import { TelegramUser, TelegramWebApp } from './types';

export class TelegramAdapter {
  private static instance: TelegramAdapter;

  private constructor() {
    if (this.isAvailable()) {
      try {
        this.getWebApp()?.ready();
        this.getWebApp()?.expand();
      } catch {
        // Safe catch if Telegram script fails to initialize
      }
    }
  }

  public static getInstance(): TelegramAdapter {
    if (!TelegramAdapter.instance) {
      TelegramAdapter.instance = new TelegramAdapter();
    }
    return TelegramAdapter.instance;
  }

  public getWebApp(): TelegramWebApp | undefined {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      return window.Telegram.WebApp;
    }
    return undefined;
  }

  public isAvailable(): boolean {
    return typeof window !== 'undefined' && !!window.Telegram?.WebApp?.initData;
  }

  public getUser(): TelegramUser | null {
    const webApp = this.getWebApp();
    if (webApp?.initDataUnsafe?.user) {
      return webApp.initDataUnsafe.user;
    }
    // Dev mode fallback user
    if (import.meta.env.DEV) {
      return {
        id: 999001,
        first_name: 'ዳግማዊ',
        last_name: 'ተጠቃሚ',
        username: 'gedame_dev',
        language_code: 'am',
      };
    }
    return null;
  }

  public getInitData(): string {
    return this.getWebApp()?.initData || '';
  }

  public getColorScheme(): 'light' | 'dark' {
    return this.getWebApp()?.colorScheme || 'light';
  }

  public setHeaderColor(color: string): void {
    try {
      this.getWebApp()?.setHeaderColor(color);
    } catch {
      // Ignore in dev
    }
  }

  public setBackgroundColor(color: string): void {
    try {
      this.getWebApp()?.setBackgroundColor(color);
    } catch {
      // Ignore in dev
    }
  }

  public openLink(url: string): void {
    if (this.isAvailable()) {
      this.getWebApp()?.openLink(url);
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  public openTelegramLink(url: string): void {
    if (this.isAvailable()) {
      this.getWebApp()?.openTelegramLink(url);
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  public close(): void {
    this.getWebApp()?.close();
  }
}

export const telegramAdapter = TelegramAdapter.getInstance();
