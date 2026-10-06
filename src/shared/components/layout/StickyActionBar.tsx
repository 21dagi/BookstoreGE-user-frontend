import React from 'react';
import { cn } from '@/shared/lib';

export interface StickyActionBarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const StickyActionBar: React.FC<StickyActionBarProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-30 bg-bg-card/95 backdrop-blur-md border-t border-border-subtle p-3.5 pb-safe shadow-lg',
        className,
      )}
      {...props}
    >
      <div className="max-w-lg mx-auto w-full flex items-center gap-3">
        {children}
      </div>
    </div>
  );
};
