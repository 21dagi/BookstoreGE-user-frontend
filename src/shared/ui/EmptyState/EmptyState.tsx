import React from 'react';
import { cn } from '@/shared/lib';
import { Icon, IconName } from '@/shared/ui/Icon';
import { useLanguage } from '@/shared/i18n';

export interface EmptyStateProps {
  icon?: IconName;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'Inbox',
  title,
  description,
  action,
  className,
}) => {
  const { t } = useLanguage();

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center rounded-2xl bg-bg-card/50 border border-dashed border-border-subtle my-4',
        className,
      )}
    >
      <div className="w-14 h-14 rounded-full bg-brand-50 flex items-center justify-center text-brand-500 mb-4 shadow-sm">
        <Icon name={icon} size={28} />
      </div>
      <h3 className="text-base font-bold text-text-primary mb-1">
        {title || t('common.empty')}
      </h3>
      {description && (
        <p className="text-xs text-text-secondary max-w-xs mb-4">
          {description}
        </p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
};
