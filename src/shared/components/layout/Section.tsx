import React from 'react';
import { cn } from '@/shared/lib';

export interface SectionProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  title?: React.ReactNode;
  action?: React.ReactNode;
  subtitle?: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({
  title,
  action,
  subtitle,
  children,
  className,
  ...props
}) => {
  return (
    <section className={cn('w-full mb-6', className)} {...props}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-2.5">
          <div>
            {title && <h2 className="text-base font-bold text-text-primary">{title}</h2>}
            {subtitle && <p className="text-xs text-text-secondary mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </section>
  );
};
