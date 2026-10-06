import React from 'react';
import { formatDate } from '@/shared/lib';
import { useLanguage } from '@/shared/i18n';
import { cn } from '@/shared/lib';

export interface DateTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  date: Date | string | number | null | undefined;
  formatType?: 'date' | 'dateTime' | 'relative';
}

export const DateText: React.FC<DateTextProps> = ({
  date,
  formatType = 'date',
  className,
  ...props
}) => {
  const { language } = useLanguage();
  const formatted = formatDate(date, language, formatType);

  return (
    <span className={cn('text-xs text-text-secondary', className)} {...props}>
      {formatted}
    </span>
  );
};
