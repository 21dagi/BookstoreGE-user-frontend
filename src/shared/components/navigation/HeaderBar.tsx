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
        'sticky top-0 z-40 w-full bg-bg-primary/95 backdrop-blur-md border-b border-border-subtle shadow-[0_2px_12px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] pt-safe select-none',
        className,
      )}
    >
      <div className="max-w-lg mx-auto flex items-center justify-between h-14 px-3.5">
        <div className="flex items-center gap-2 min-w-0">
          {showBack && <BackButton onBack={onBack} />}
          <div className="min-w-0">
            {title && (
              <h1 className="text-[16px] font-bold text-text-primary truncate leading-tight">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-[11px] text-text-secondary truncate leading-none mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {showLanguageToggle && (
            <button
              type="button"
              onClick={() => changeLanguage(language === 'am' ? 'en' : 'am')}
              className="h-9 px-2.5 rounded-full bg-bg-card border border-border-subtle shadow-sm hover:border-brand-500/50 flex items-center gap-1.5 active:scale-95 transition-all text-text-primary"
              aria-label="Toggle language"
            >
              <Icon name="Globe" size={15} className="text-brand-500 shrink-0" />
              <span className="text-[11.5px] font-bold tracking-tight">
                {language === 'am' ? 'አማ' : 'EN'}
              </span>
            </button>
          )}

          {showThemeToggle && (
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
          )}

          {rightAction}
        </div>
      </div>
    </header>
  );
};
