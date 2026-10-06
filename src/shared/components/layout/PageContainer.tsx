import React from 'react';
import { cn } from '@/shared/lib';

export interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  withBottomNav?: boolean;
  withStickyAction?: boolean;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className,
  withBottomNav = false,
  withStickyAction = false,
  ...props
}) => {
  return (
    <main
      className={cn(
        'w-full max-w-lg mx-auto min-h-screen px-4 py-3 flex flex-col',
        withBottomNav && 'pb-[84px]',
        withStickyAction && 'pb-[96px]',
        className,
      )}
      {...props}
    >
      {children}
    </main>
  );
};
