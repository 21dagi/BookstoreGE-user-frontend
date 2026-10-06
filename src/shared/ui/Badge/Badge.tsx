import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib';

const badgeVariants = cva(
  'inline-flex items-center justify-center font-bold leading-none rounded-full transition-colors select-none',
  {
    variants: {
      variant: {
        brand: 'bg-brand-500 text-white',
        accent: 'bg-accent-500 text-white',
        neutral: 'bg-bg-tertiary text-text-primary',
        danger: 'bg-status-danger-text text-white',
        success: 'bg-status-success-text text-white',
      },
      size: {
        sm: 'h-4 min-w-[16px] px-1 text-[10px]',
        md: 'h-5 min-w-[20px] px-1.5 text-xs',
        dot: 'h-2 w-2 p-0',
      },
    },
    defaultVariants: {
      variant: 'brand',
      size: 'md',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  count?: number;
  maxCount?: number;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant,
  size,
  count,
  maxCount = 99,
  children,
  ...props
}) => {
  const displayContent =
    count !== undefined ? (count > maxCount ? `${maxCount}+` : count) : children;

  return (
    <span className={cn(badgeVariants({ variant, size, className }))} {...props}>
      {size !== 'dot' && displayContent}
    </span>
  );
};
