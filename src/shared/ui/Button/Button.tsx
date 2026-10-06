import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib';
import { Spinner } from '@/shared/ui/Spinner';

const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none active:scale-[0.98]',
  {
    variants: {
      variant: {
        primary:
          'bg-brand-500 text-white hover:bg-brand-600 active:bg-brand-700 shadow-sm border border-transparent',
        secondary:
          'bg-bg-secondary text-text-primary hover:bg-bg-tertiary border border-border-primary',
        outline:
          'border border-brand-500 text-brand-500 hover:bg-brand-50 active:bg-brand-100 bg-transparent',
        ghost:
          'text-text-primary hover:bg-bg-secondary active:bg-bg-tertiary bg-transparent border-transparent',
        accent:
          'bg-accent-500 text-white hover:bg-accent-600 active:bg-accent-700 shadow-sm border border-transparent',
        danger:
          'bg-status-danger-text text-white hover:opacity-90 active:opacity-100 border border-transparent',
      },
      size: {
        sm: 'min-h-[36px] px-3 py-1.5 text-xs rounded-md gap-1.5',
        md: 'min-h-[44px] px-4 py-2.5 text-sm rounded-lg gap-2',
        lg: 'min-h-[50px] px-6 py-3.5 text-base rounded-xl gap-2.5 font-semibold',
        icon: 'min-h-[44px] min-w-[44px] p-2 rounded-lg',
      },
      fullWidth: {
        true: 'w-full',
        false: 'w-auto',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      isLoading = false,
      disabled,
      children,
      leftIcon,
      rightIcon,
      type = 'button',
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-busy={isLoading}
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        {...props}
      >
        {isLoading ? (
          <Spinner
            size="sm"
            color={variant === 'primary' || variant === 'accent' || variant === 'danger' ? 'white' : 'brand'}
          />
        ) : (
          leftIcon
        )}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </button>
    );
  },
);

Button.displayName = 'Button';
