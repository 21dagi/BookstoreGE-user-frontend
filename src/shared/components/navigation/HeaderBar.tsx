import React from 'react';
import { cn } from '@/shared/lib';
import { BackButton } from './BackButton';

export interface HeaderBarProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  className?: string;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  title,
  subtitle,
  showBack = false,
  onBack,
  rightAction,
  className,
}) => {
  return (
    <header
      className={cn(
        'sticky top-0 z-30 w-full bg-bg-primary/95 backdrop-blur-md border-b border-border-subtle pt-safe select-none',
        className,
      )}
    >
      <div className="max-w-lg mx-auto flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-2 min-w-0">
          {showBack && <BackButton onBack={onBack} />}
          <div className="min-w-0">
            {title && (
              <h1 className="text-base font-bold text-text-primary truncate">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-xs text-text-secondary truncate">{subtitle}</p>
            )}
          </div>
        </div>
        {rightAction && <div className="flex items-center gap-2 shrink-0">{rightAction}</div>}
      </div>
    </header>
  );
};
