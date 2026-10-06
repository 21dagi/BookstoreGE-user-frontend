import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib';

const spinnerVariants = cva('animate-spin rounded-full border-solid border-current border-t-transparent', {
  variants: {
    size: {
      sm: 'w-4 h-4 border-2',
      md: 'w-6 h-6 border-2',
      lg: 'w-8 h-8 border-3',
      xl: 'w-12 h-12 border-4',
    },
    color: {
      brand: 'text-brand-500',
      accent: 'text-accent-500',
      white: 'text-white',
      current: 'text-current',
      muted: 'text-text-muted',
    },
  },
  defaultVariants: {
    size: 'md',
    color: 'brand',
  },
});

export interface SpinnerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'>,
    VariantProps<typeof spinnerVariants> {
  label?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size,
  color,
  label = 'Loading...',
  className,
  ...props
}) => {
  return (
    <div
      role="status"
      aria-label={label}
      className={cn('inline-flex items-center justify-center', className)}
      {...props}
    >
      <div className={cn(spinnerVariants({ size, color }))} />
      <span className="sr-only">{label}</span>
    </div>
  );
};
