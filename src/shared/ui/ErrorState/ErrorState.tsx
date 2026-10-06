import React from 'react';
import { cn } from '@/shared/lib';
import { Icon } from '@/shared/ui/Icon';
import { Button } from '@/shared/ui/Button';
import { useLanguage } from '@/shared/i18n';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title,
  message,
  onRetry,
  className,
}) => {
  const { t } = useLanguage();

  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center rounded-2xl bg-status-danger-bg/20 border border-status-danger-border my-4',
        className,
      )}
    >
      <div className="w-14 h-14 rounded-full bg-status-danger-bg flex items-center justify-center text-status-danger-text mb-4 shadow-sm">
        <Icon name="AlertTriangle" size={28} />
      </div>
      <h3 className="text-base font-bold text-text-primary mb-1">
        {title || t('common.errorTitle')}
      </h3>
      <p className="text-xs text-text-secondary max-w-xs mb-4">
        {message || t('common.errorMessage')}
      </p>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          leftIcon={<Icon name="RotateCcw" size={14} />}
        >
          {t('common.retry')}
        </Button>
      )}
    </div>
  );
};
