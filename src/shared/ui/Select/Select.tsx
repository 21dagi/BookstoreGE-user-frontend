import React, { useId } from 'react';
import { cn } from '@/shared/lib';
import { Icon } from '@/shared/ui/Icon';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, options, id: customId, disabled, ...props }, ref) => {
    const autoId = useId();
    const selectId = customId || autoId;
    const errorId = `${selectId}-error`;
    const helperId = `${selectId}-helper`;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="mb-1.5 block text-xs font-semibold text-text-secondary">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            className={cn(
              'w-full min-h-[44px] appearance-none rounded-lg border bg-bg-card pl-3.5 pr-10 py-2 text-sm text-text-primary transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500',
              'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-bg-secondary',
              error ? 'border-status-danger-text focus:ring-status-danger-text' : 'border-border-primary',
              className,
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-3 flex items-center text-text-muted">
            <Icon name="ChevronDown" size={18} />
          </div>
        </div>
        {error ? (
          <p id={errorId} role="alert" className="mt-1 text-xs text-status-danger-text font-medium">
            {error}
          </p>
        ) : helperText ? (
          <p id={helperId} className="mt-1 text-xs text-text-muted">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  },
);

Select.displayName = 'Select';
