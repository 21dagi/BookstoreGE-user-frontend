import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib';

const cardVariants = cva(
  'rounded-xl border transition-all text-text-primary overflow-hidden',
  {
    variants: {
      variant: {
        default: 'bg-bg-card border-border-subtle shadow-card',
        elevated: 'bg-bg-elevated border-border-subtle shadow-md',
        outline: 'bg-transparent border-border-primary',
        flat: 'bg-bg-secondary border-transparent',
        interactive:
          'bg-bg-card border-border-subtle shadow-card hover:border-brand-500/40 hover:shadow-md cursor-pointer active:scale-[0.99]',
      },
      padding: {
        none: 'p-0',
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
    },
  },
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, padding, className }))}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = 'Card';
