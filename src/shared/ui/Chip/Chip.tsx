import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib';

const chipVariants = cva(
  'inline-flex items-center justify-center font-medium rounded-full transition-colors select-none text-xs min-h-[32px] px-3 py-1 gap-1.5',
  {
    variants: {
      variant: {
        default: 'bg-bg-secondary text-text-primary hover:bg-bg-tertiary',
        active: 'bg-brand-500 text-white shadow-sm',
        outline: 'border border-border-primary text-text-secondary bg-transparent hover:border-brand-500',
        accent: 'bg-accent-100 text-accent-800 border border-accent-200',
      },
      interactive: {
        true: 'cursor-pointer active:scale-95',
        false: 'cursor-default',
      },
    },
    defaultVariants: {
      variant: 'default',
      interactive: true,
    },
  },
);

export interface ChipProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chipVariants> {
  selected?: boolean;
  leftIcon?: React.ReactNode;
}

export const Chip: React.FC<ChipProps> = ({
  className,
  variant,
  selected,
  interactive = true,
  leftIcon,
  children,
  ...props
}) => {
  const activeVariant = selected ? 'active' : variant;

  return (
    <div
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      className={cn(chipVariants({ variant: activeVariant, interactive, className }))}
      {...props}
    >
      {leftIcon}
      <span>{children}</span>
    </div>
  );
};
