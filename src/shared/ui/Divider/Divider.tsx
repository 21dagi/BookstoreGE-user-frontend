import React from 'react';
import { cn } from '@/shared/lib';

export interface DividerProps {
  className?: string;
  label?: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
}

export const Divider: React.FC<DividerProps> = ({
  className,
  label,
  orientation = 'horizontal',
}) => {
  if (orientation === 'vertical') {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={cn('h-full w-[1px] bg-border-subtle shrink-0', className)}
      />
    );
  }

  if (label) {
    return (
      <div
        role="separator"
        className={cn('relative flex items-center py-2', className)}
      >
        <div className="flex-grow border-t border-border-subtle" />
        <span className="shrink mx-3 text-xs font-medium text-text-muted">
          {label}
        </span>
        <div className="flex-grow border-t border-border-subtle" />
      </div>
    );
  }

  return (
    <hr
      className={cn('border-0 border-t border-border-subtle my-3', className)}
    />
  );
};
