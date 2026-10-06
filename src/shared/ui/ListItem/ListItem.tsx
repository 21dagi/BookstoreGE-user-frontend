import React from 'react';
import { cn } from '@/shared/lib';
import { Icon } from '@/shared/ui/Icon';

export interface ListItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  leading?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  trailing?: React.ReactNode;
  showChevron?: boolean;
  interactive?: boolean;
}

export const ListItem: React.FC<ListItemProps> = ({
  leading,
  title,
  subtitle,
  trailing,
  showChevron = false,
  interactive = false,
  className,
  ...props
}) => {
  return (
    <div
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      className={cn(
        'flex min-h-[56px] items-center justify-between gap-3 px-4 py-3 bg-bg-card transition-colors select-none',
        interactive && 'cursor-pointer hover:bg-bg-secondary active:bg-bg-tertiary',
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-3 min-w-0">
        {leading && <div className="shrink-0">{leading}</div>}
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium text-text-primary truncate">{title}</div>
          {subtitle && (
            <div className="text-xs text-text-secondary truncate mt-0.5">{subtitle}</div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {trailing}
        {showChevron && <Icon name="ChevronRight" size={18} className="text-text-muted" />}
      </div>
    </div>
  );
};
