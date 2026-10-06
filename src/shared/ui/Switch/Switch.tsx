import React, { useId } from 'react';
import { cn } from '@/shared/lib';

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  className,
  id: customId,
}) => {
  const autoId = useId();
  const switchId = customId || autoId;

  return (
    <label
      htmlFor={switchId}
      className={cn(
        'inline-flex min-h-[44px] items-center justify-between gap-3 cursor-pointer select-none',
        disabled && 'cursor-not-allowed opacity-50',
        className,
      )}
    >
      {label && <span className="text-sm font-medium text-text-primary">{label}</span>}
      <div className="relative inline-flex items-center">
        <input
          type="checkbox"
          id={switchId}
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <div
          className={cn(
            'h-6 w-11 rounded-full transition-colors duration-200',
            checked ? 'bg-brand-500' : 'bg-border-strong',
          )}
        />
        <div
          className={cn(
            'absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform duration-200 shadow-sm',
            checked && 'translate-x-5',
          )}
        />
      </div>
    </label>
  );
};
