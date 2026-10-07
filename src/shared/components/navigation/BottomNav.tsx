import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/shared/lib';
import { Icon, IconName } from '@/shared/ui/Icon';
import { ROUTES } from '@/shared/constants';
import { useLanguage } from '@/shared/i18n';

export interface NavItemConfig {
  path: string;
  icon: IconName;
  labelKey: string;
  center?: boolean;
}

// 5 items with Equb as the center circular action
export const NAV_ITEMS: NavItemConfig[] = [
  { path: ROUTES.HOME,         icon: 'Home',      labelKey: 'nav.home'    },
  { path: ROUTES.CATALOG.ROOT, icon: 'BookOpen',  labelKey: 'nav.books'   },
  { path: ROUTES.EQUB.ROOT,    icon: 'Users',     labelKey: 'nav.equb', center: true },
  { path: ROUTES.WALLET.ROOT,  icon: 'Wallet',    labelKey: 'nav.wallet'  },
  { path: ROUTES.PROFILE.ROOT, icon: 'Newspaper', labelKey: 'nav.news'    },
];

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const { t } = useLanguage();

  return (
    <nav
      role="navigation"
      aria-label="Main Navigation"
      className="fixed bottom-0 left-0 right-0 max-w-[440px] mx-auto z-50 select-none pointer-events-none"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 8px)' }}
    >
      {/* 
        Solid opaque dark overlay container matching user inspiration:
        - Deep solid background so scrolled content NEVER interferes or washes out icons
        - Smooth rounded capsule top & shadow
      */}
      <div className="mx-2 mb-1.5 rounded-[26px] bg-[#171417] text-white shadow-[0_12px_40px_rgba(0,0,0,0.65)] border border-white/10 pointer-events-auto">
        <div className="flex items-center justify-around h-16 px-2 relative">
          {NAV_ITEMS.map((item) => {
            const isActive = item.path === ROUTES.HOME
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path);

            const label = t(item.labelKey);

            if (item.center) {
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={false}
                  className="flex flex-col items-center justify-center flex-1 -mt-7 relative group"
                  aria-label={label}
                >
                  {/* Elevated center circle button matching inspiration */}
                  <div
                    className={cn(
                      'w-13 h-13 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-[0_6px_24px_rgba(122,35,48,0.6)] border-3 border-[#171417]',
                      isActive
                        ? 'bg-gradient-to-tr from-[#9B2236] to-[#DC2626] scale-105 shadow-[0_8px_28px_rgba(220,38,38,0.55)]'
                        : 'bg-gradient-to-tr from-[#681926] to-[#9B2236] hover:scale-105',
                    )}
                    style={{ width: '54px', height: '54px' }}
                  >
                    <Icon name={item.icon} size={25} className="text-white drop-shadow" />
                  </div>
                  <span
                    className={cn(
                      'text-[10px] mt-1 font-semibold tracking-tight transition-colors',
                      isActive ? 'text-white font-bold' : 'text-white/60 group-hover:text-white/80',
                    )}
                  >
                    {label}
                  </span>
                </NavLink>
              );
            }

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === ROUTES.HOME}
                className="flex flex-col items-center justify-center flex-1 py-1 gap-1 transition-all group"
                aria-label={label}
              >
                <div
                  className={cn(
                    'w-7 h-7 flex items-center justify-center transition-all duration-200',
                    isActive ? 'scale-110' : 'group-hover:scale-105',
                  )}
                >
                  <Icon
                    name={item.icon}
                    size={22}
                    className={cn(
                      'transition-colors duration-200',
                      isActive
                        ? 'text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.4)]'
                        : 'text-white/45 group-hover:text-white/70',
                    )}
                  />
                </div>
                <span
                  className={cn(
                    'text-[10px] tracking-tight transition-colors duration-200',
                    isActive
                      ? 'text-white font-bold'
                      : 'text-white/50 font-medium group-hover:text-white/80',
                  )}
                >
                  {label}
                </span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
