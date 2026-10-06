import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar } from '@/shared/ui/Avatar';
import { Icon } from '@/shared/ui/Icon';
import { Badge } from '@/shared/ui/Badge';
import { useLanguage } from '@/shared/i18n';
import { ROUTES } from '@/shared/constants';
import { telegramAdapter } from '@/shared/telegram';
import { cn } from '@/shared/lib';

interface HomeHeaderProps {
  unreadCount?: number;
  onLanguageToggle: () => void;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({
  unreadCount = 0,
  onLanguageToggle,
}) => {
  const { language, t } = useLanguage();
  const user = telegramAdapter.getUser();
  const displayName = user?.first_name ?? t('common.appName');

  const greeting = language === 'am' ? `ሰላም፣ ${displayName}` : `Hello, ${displayName}`;
  const subGreeting = language === 'am' ? 'እንደምን አደሩ! • ደህና መጡ' : 'Good to see you!';

  return (
    <header className="pt-safe px-5 pt-4 pb-2 bg-bg-primary">
      <div className="flex items-center justify-between">
        {/* Greeting + Avatar */}
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <Avatar
              name={displayName}
              src={user?.photo_url}
              size="md"
            />
            <span
              className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-bg-primary"
              aria-hidden="true"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[17px] font-bold text-text-primary leading-tight truncate">
              {greeting}
            </span>
            <span className="text-[12px] text-text-secondary leading-tight mt-0.5">
              {subGreeting}
            </span>
          </div>
        </div>

        {/* Right: Language Toggle + Notification Bell */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onLanguageToggle}
            className="h-8 px-2.5 rounded-full bg-bg-card border border-border-primary text-[11px] font-semibold text-text-primary flex items-center gap-1.5 shadow-sm hover:border-accent-500 active:scale-95 transition-all min-h-[36px]"
            aria-label="Switch language"
          >
            <Icon name="Globe" size={14} className="text-accent-500" />
            <span className={cn('font-bold', language === 'am' ? 'text-brand-500' : 'text-text-muted')}>አማ</span>
            <span className="text-border-strong">/</span>
            <span className={cn(language === 'en' ? 'text-brand-500 font-bold' : 'text-text-muted font-normal')}>EN</span>
          </button>

          <Link
            to={ROUTES.NOTIFICATIONS}
            className="relative w-10 h-10 rounded-full bg-bg-card border border-border-subtle shadow-sm flex items-center justify-center text-text-primary hover:bg-bg-secondary active:scale-95 transition-transform"
            aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
          >
            <Icon name="Bell" size={22} />
            {unreadCount > 0 && (
              <Badge
                size="dot"
                variant="danger"
                className="absolute top-2 right-2.5"
              />
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};
