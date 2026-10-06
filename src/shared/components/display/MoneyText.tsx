import React from 'react';
import { formatMoney } from '@/shared/lib';
import { useLanguage } from '@/shared/i18n';
import { cn } from '@/shared/lib';

export interface MoneyTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  amount: number | string | null | undefined;
  showCurrency?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'brand' | 'success' | 'danger';
}

export const MoneyText: React.FC<MoneyTextProps> = ({
  amount,
  showCurrency = true,
  size = 'md',
  variant = 'default',
  className,
  ...props
}) => {
  const { language } = useLanguage();
  const formatted = formatMoney(amount, language, { showCurrency });

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm font-semibold',
    lg: 'text-lg font-bold',
    xl: 'text-2xl font-extrabold',
  };

  const variantClasses = {
    default: 'text-text-primary',
    brand: 'text-brand-500',
    success: 'text-status-success-text',
    danger: 'text-status-danger-text',
  };

  return (
    <span
      className={cn('tabular-nums inline-flex items-baseline', sizeClasses[size], variantClasses[variant], className)}
      {...props}
    >
      {formatted}
    </span>
  );
};
