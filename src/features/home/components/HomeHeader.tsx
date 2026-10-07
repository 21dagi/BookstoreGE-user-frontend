import React, { useState } from 'react';
import { Icon } from '@/shared/ui/Icon';
import { Badge } from '@/shared/ui/Badge';
import { useLanguage } from '@/shared/i18n';
import { useThemeStore } from '@/shared/theme';
import { telegramAdapter } from '@/shared/telegram';
import { NotificationPanel } from '@/shared/components/display/NotificationPanel';

interface HomeHeaderProps {
  unreadCount?: number;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({ unreadCount = 0 }) => {
  const { language, changeLanguage } = useLanguage();
  const { resolvedTheme, toggleTheme } = useThemeStore();
  const user = telegramAdapter.getUser();
  const displayName = user?.first_name ?? '';
  const [notifOpen, setNotifOpen] = useState(false);

  const greeting = language === 'am'
    ? (displayName ? `ሰላም፣ ${displayName}` : 'ሰላም!')
    : (displayName ? `Hello, ${displayName}` : 'Hello!');

  return (
    <>
      <header className="sticky top-0 z-40 bg-bg-primary/95 backdrop-blur-md border-b border-border-subtle shadow-[0_2px_12px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] px-4 py-2.5">
        <div className="flex items-center justify-between">
          {/* Left: Logo + Greeting */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0 shadow-sm border border-border-subtle">
              <img src="/app-logo.png" alt="logo" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[16px] font-extrabold text-text-primary truncate leading-tight">
                {greeting}
              </span>
              <span className="text-[10.5px] font-medium text-text-muted leading-none mt-0.5 truncate">
                {language === 'am' ? 'የኰኵሐ ሃይማኖት ሰንበት ት/ቤት' : 'Kokoha Haymanot'}
              </span>
            </div>
          </div>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Language Switcher Button with distinct Globe icon */}
            <button
              type="button"
              onClick={() => changeLanguage(language === 'am' ? 'en' : 'am')}
              className="h-9 px-2.5 rounded-full bg-bg-card border border-border-subtle shadow-sm hover:border-brand-500/50 flex items-center gap-1.5 active:scale-95 transition-all text-text-primary"
              aria-label="Switch language"
            >
              <Icon name="Globe" size={15} className="text-brand-500 shrink-0" />
              <span className="text-[11.5px] font-bold tracking-tight">
                {language === 'am' ? 'አማ' : 'EN'}
              </span>
            </button>

            {/* Dark / Light Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="h-9 w-9 rounded-full bg-bg-card border border-border-subtle shadow-sm flex items-center justify-center text-text-primary active:scale-95 transition-all"
              aria-label="Toggle theme"
            >
              {resolvedTheme === 'dark' ? (
                <Icon name="Sun" size={17} className="text-amber-400" />
              ) : (
                <Icon name="Moon" size={17} className="text-brand-500" />
              )}
            </button>

            {/* Notification Bell */}
            <button
              type="button"
              onClick={() => setNotifOpen(true)}
              className="relative h-9 w-9 rounded-full bg-bg-card border border-border-subtle shadow-sm flex items-center justify-center text-text-primary active:scale-95 transition-all"
              aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
            >
              <Icon name="Bell" size={18} />
              {unreadCount > 0 && (
                <Badge size="dot" variant="danger" className="absolute top-2 right-2" />
              )}
            </button>
          </div>
        </div>
      </header>

      <NotificationPanel
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
        unreadCount={unreadCount}
      />
    </>
  );
};
