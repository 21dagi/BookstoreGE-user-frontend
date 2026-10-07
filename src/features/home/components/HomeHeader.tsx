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
      <header className="pt-safe px-4 pt-3 pb-2 bg-bg-primary">
        <div className="flex items-center justify-between">
          {/* Left: Logo + greeting */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl overflow-hidden shrink-0 shadow-sm border border-border-subtle">
              <img src="/app-logo.png" alt="logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-[15px] font-bold text-text-primary truncate">{greeting}</span>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Language toggle — single button that cycles */}
            <button
              type="button"
              onClick={() => changeLanguage(language === 'am' ? 'en' : 'am')}
              className="h-8 w-8 rounded-full bg-bg-card border border-border-subtle flex items-center justify-center shadow-sm active:scale-95 transition-all"
              aria-label="Switch language"
            >
              <span className="text-[11px] font-extrabold text-brand-500 leading-none">
                {language === 'am' ? 'EN' : 'አማ'}
              </span>
            </button>

            {/* Dark/Light toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="h-8 w-8 rounded-full bg-bg-card border border-border-subtle flex items-center justify-center shadow-sm active:scale-95 transition-all"
              aria-label="Toggle theme"
            >
              {resolvedTheme === 'dark'
                ? <Icon name="Sun" size={15} className="text-amber-400" />
                : <Icon name="Moon" size={15} className="text-brand-500" />
              }
            </button>

            {/* Notification bell */}
            <button
              type="button"
              onClick={() => setNotifOpen(true)}
              className="relative h-8 w-8 rounded-full bg-bg-card border border-border-subtle flex items-center justify-center shadow-sm active:scale-95 transition-all"
              aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
            >
              <Icon name="Bell" size={17} />
              {unreadCount > 0 && (
                <Badge size="dot" variant="danger" className="absolute top-1.5 right-1.5" />
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
