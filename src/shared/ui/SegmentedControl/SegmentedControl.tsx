import React from 'react';
import { cn } from '@/shared/lib';

export interface SegmentOption<T extends string = string> {
  value: T;
  label: React.ReactNode;
}

export interface SegmentedControlProps<T extends string = string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  size?: 'sm' | 'md';
}

export function SegmentedControl<T extends string = string>({
  options,
  value,
  onChange,
  className,
  size = 'md',
}: SegmentedControlProps<T>) {
  return (
    <div
      role="radiogroup"
      className={cn(
        'inline-flex w-full items-center rounded-xl bg-bg-secondary p-1 border border-border-subtle select-none',
        className,
      )}
    >
      {options.map((option) => {
        const isSelected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(option.value)}
            className={cn(
              'flex-1 flex items-center justify-center font-medium rounded-lg transition-all duration-200 min-h-[38px] text-xs',
              size === 'sm' ? 'py-1 min-h-[32px]' : 'py-2 min-h-[40px]',
              isSelected
                ? 'bg-bg-card text-brand-500 font-bold shadow-sm'
                : 'text-text-secondary hover:text-text-primary',
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
