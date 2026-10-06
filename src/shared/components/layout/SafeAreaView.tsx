import React from 'react';
import { cn } from '@/shared/lib';

export interface SafeAreaViewProps extends React.HTMLAttributes<HTMLDivElement> {
  edges?: ('top' | 'bottom' | 'all')[];
}

export const SafeAreaView: React.FC<SafeAreaViewProps> = ({
  edges = ['all'],
  className,
  children,
  ...props
}) => {
  const hasTop = edges.includes('all') || edges.includes('top');
  const hasBottom = edges.includes('all') || edges.includes('bottom');

  return (
    <div
      className={cn(
        hasTop && 'pt-safe',
        hasBottom && 'pb-safe',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
