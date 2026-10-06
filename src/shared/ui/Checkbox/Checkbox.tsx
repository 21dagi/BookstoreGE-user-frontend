import React, { useId } from 'react';
import { cn } from '@/shared/lib';
import { Icon } from '@/shared/ui/Icon';

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
  error?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, checked, id: customId, disabled, ...props }, ref) => {
    const autoId = useId();
    const checkboxId = customId || autoId;

    return (
      <div className="flex flex-col">
        <label
          htmlFor={checkboxId}
          className={cn(
            'inline-flex min-h-[44px] items-center gap-3 cursor-pointer select-none',
            disabled && 'cursor-not-allowed opacity-50',
            className,
          )}
        >
          <div className="relative flex items-center justify-center">
            <input
              ref={ref}
              type="checkbox"
              id={checkboxId}
              checked={checked}
              disabled={disabled}
              className="peer sr-only"
              {...props}
            />
            <div
              className={cn(
                'h-5 w-5 rounded-md border transition-all flex items-center justify-center',
                checked
                  ? 'bg-brand-500 border-brand-500 text-white'
                  : 'border-border-strong bg-bg-card hover:border-brand-500',
                error && 'border-status-danger-text',
              )}
            >
              {checked && <Icon name="Check" size={14} className="stroke-[3]" />}
            </div>
          </div>
          {label && <span className="text-sm text-text-primary">{label}</span>}
        </label>
        {error && <p className="ml-8 text-xs text-status-danger-text font-medium">{error}</p>}
      </div>
    );
  },
);

Checkbox.displayName = 'Checkbox';
