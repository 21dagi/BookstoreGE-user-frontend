import React from 'react';
import { cn } from '@/shared/lib';
import { BackButton } from './BackButton';
import { useLanguage } from '@/shared/i18n';
import { useThemeStore } from '@/shared/theme';
import { Icon } from '@/shared/ui/Icon';

export interface HeaderBarProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  showBack?: boolean;
  onBack?: () => void;
  showLanguageToggle?: boolean;
  showThemeToggle?: boolean;
  rightAction?: React.ReactNode;
  className?: string;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  title,
  subtitle,
  showBack = false,
  onBack,
  showLanguageToggle = false,
  showThemeToggle = false,
  rightAction,
  className,
}) => {
  const { language, changeLanguage } = useLanguage();
  const { resolvedTheme, toggleTheme } = useThemeStore();

  return (
    <header
      className={cn(
        'sticky top-0 z-30 w-full bg-bg-primary/95 backdrop-blur-md border-b border-border-subtle pt-safe select-none',
        className,
      )}
    >
      <div className="max-w-lg mx-auto flex items-center justify-between h-12 px-3">
        <div className="flex items-center gap-1.5 min-w-0">
          {showBack && <BackButton onBack={onBack} className="min-h-[36px] min-w-[36px] p-1 -ml-1" />}
          <div className="min-w-0">
            {title && (
              <h1 className="text-[15px] font-bold text-text-primary truncate leading-tight">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-[11px] text-text-secondary truncate leading-none mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {showLanguageToggle && (
            <button
              type="button"
              onClick={() => changeLanguage(language === 'am' ? 'en' : 'am')}
              className="h-7 w-7 rounded-full bg-bg-card border border-border-subtle flex items-center justify-center shadow-sm active:scale-95 transition-all"
              aria-label="Toggle language"
            >
              <span className="text-[10px] font-extrabold text-brand-500">
                {language === 'am' ? 'EN' : 'አማ'}
              </span>
            </button>
          )}

          {showThemeToggle && (
            <button
              type="button"
              onClick={toggleTheme}
              className="h-7 w-7 rounded-full bg-bg-card border border-border-subtle flex items-center justify-center shadow-sm active:scale-95 transition-all"
              aria-label="Toggle theme"
            >
              {resolvedTheme === 'dark' ? (
                <Icon name="Sun" size={13} className="text-amber-400" />
              ) : (
                <Icon name="Moon" size={13} className="text-brand-500" />
              )}
            </button>
          )}

          {rightAction}
        </div>
      </div>
    </header>
  );
};
