import React, { useId } from 'react';
import { cn } from '@/shared/lib';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      leftElement,
      rightElement,
      id: customId,
      disabled,
      ...props
    },
    ref,
  ) => {
    const autoId = useId();
    const inputId = customId || autoId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-xs font-semibold text-text-secondary"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftElement && (
            <div className="pointer-events-none absolute left-3 flex items-center text-text-muted">
              {leftElement}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            className={cn(
              'w-full min-h-[44px] rounded-lg border bg-bg-card px-3.5 py-2 text-sm text-text-primary transition-colors',
              'placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500',
              'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-bg-secondary',
              error ? 'border-status-danger-text focus:ring-status-danger-text' : 'border-border-primary',
              leftElement ? 'pl-10' : '',
              rightElement ? 'pr-10' : '',
              className,
            )}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 flex items-center text-text-muted">
              {rightElement}
            </div>
          )}
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

Input.displayName = 'Input';
