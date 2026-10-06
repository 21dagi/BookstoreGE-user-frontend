import React from 'react';
import { MoneyText } from './MoneyText';
import { cn } from '@/shared/lib';

export interface PriceTagProps {
  price: number;
  originalPrice?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const PriceTag: React.FC<PriceTagProps> = ({
  price,
  originalPrice,
  className,
  size = 'md',
}) => {
  const hasDiscount = originalPrice !== undefined && originalPrice > price;

  return (
    <div className={cn('flex items-baseline gap-2', className)}>
      <MoneyText amount={price} size={size} variant="brand" />
      {hasDiscount && (
        <span className="text-xs text-text-muted line-through">
          <MoneyText amount={originalPrice} size="sm" variant="default" />
        </span>
      )}
    </div>
  );
};
