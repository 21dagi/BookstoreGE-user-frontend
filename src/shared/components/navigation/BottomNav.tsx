import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/shared/lib';
import { Icon, IconName } from '@/shared/ui/Icon';
import { ROUTES } from '@/shared/constants';
import { useLanguage } from '@/shared/i18n';

import { useThemeStore } from '@/shared/theme';

export interface NavItemConfig {
  path: string;
  icon: IconName;
  labelKey: string;
}

export const NAV_ITEMS: NavItemConfig[] = [
  { path: ROUTES.HOME, icon: 'Home', labelKey: 'nav.home' },
  { path: ROUTES.CATALOG.ROOT, icon: 'BookOpen', labelKey: 'nav.books' },
  { path: ROUTES.EQUB.ROOT, icon: 'Users', labelKey: 'nav.equb' },
  { path: ROUTES.WALLET.ROOT, icon: 'Wallet', labelKey: 'nav.wallet' },
  { path: ROUTES.PROFILE.ROOT, icon: 'User', labelKey: 'nav.profile' },
];

export const BottomNav: React.FC = () => {
  const { t, language } = useLanguage();
  const { resolvedTheme, toggleTheme } = useThemeStore();

  return (
    <nav
      role="navigation"
      aria-label="Main Navigation"
      className="fixed bottom-0 left-0 right-0 max-w-[440px] mx-auto z-40 bg-bg-card/95 backdrop-blur-md border-t border-border-subtle shadow-bottom pb-safe select-none"
    >
      <div className="flex items-center justify-around h-16 px-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === ROUTES.HOME}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center flex-1 py-1 min-h-[44px] transition-colors',
                isActive
                  ? 'text-brand-500 font-bold'
                  : 'text-text-muted hover:text-text-primary',
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  name={item.icon}
                  size={19}
                  className={cn(
                    'transition-transform',
                    isActive && 'scale-110 text-brand-500',
                  )}
                />
                <span className="text-[10px] mt-1 tracking-tight">
                  {t(item.labelKey)}
                </span>
              </>
            )}
          </NavLink>
        ))}

        {/* Dark / Light Mode Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
          className="flex flex-col items-center justify-center flex-1 py-1 min-h-[44px] text-text-muted hover:text-text-primary active:scale-95 transition-transform"
        >
          {resolvedTheme === 'dark' ? (
            <Icon name="Sun" size={19} className="text-amber-400" />
          ) : (
            <Icon name="Moon" size={19} className="text-brand-500" />
          )}
          <span className="text-[10px] mt-1 tracking-tight">
            {resolvedTheme === 'dark' ? (language === 'am' ? 'ብርሃን' : 'Light') : (language === 'am' ? 'ጨለማ' : 'Dark')}
          </span>
        </button>
      </div>
    </nav>
  );
};
