import React, { useState } from 'react';
import { cn } from '@/shared/lib';
import { Icon } from '@/shared/ui/Icon';

export interface BookCoverProps {
  src?: string;
  title: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const BookCover: React.FC<BookCoverProps> = ({
  src,
  title,
  size = 'md',
  className,
}) => {
  const [hasError, setHasError] = useState(!src);

  const sizeClasses = {
    sm: 'w-12 h-16 text-xs',
    md: 'w-20 h-28 text-sm',
    lg: 'w-32 h-44 text-base',
  };

  return (
    <div
      className={cn(
        'relative rounded-lg overflow-hidden shrink-0 bg-brand-100 border border-border-subtle shadow-sm flex items-center justify-center select-none aspect-[2/3]',
        sizeClasses[size],
        className,
      )}
    >
      {src && !hasError ? (
        <img
          src={src}
          alt={title}
          onError={() => setHasError(true)}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="flex flex-col items-center justify-center p-2 text-center text-brand-700 bg-brand-50 w-full h-full">
          <Icon name="Book" size={size === 'sm' ? 16 : 24} />
          <span className="text-[10px] font-bold line-clamp-2 mt-1 px-1">
            {title}
          </span>
        </div>
      )}
    </div>
  );
};
