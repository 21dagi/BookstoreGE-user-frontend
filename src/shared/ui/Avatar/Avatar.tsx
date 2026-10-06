import React from 'react';
import { cn } from '@/shared/lib';

export interface AvatarProps {
  src?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-base',
  xl: 'w-20 h-20 text-xl font-bold',
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name = 'G',
  size = 'md',
  className,
}) => {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center rounded-full bg-brand-100 text-brand-700 font-semibold overflow-hidden select-none border border-brand-200',
        sizeClasses[size],
        className,
      )}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      ) : (
        <span>{initials || 'G'}</span>
      )}
    </div>
  );
};
