import React, { useId } from 'react';
import { cn } from '@/shared/lib';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id: customId, disabled, rows = 3, ...props }, ref) => {
    const autoId = useId();
    const textareaId = customId || autoId;
    const errorId = `${textareaId}-error`;
    const helperId = `${textareaId}-helper`;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={textareaId} className="mb-1.5 block text-xs font-semibold text-text-secondary">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          className={cn(
            'w-full rounded-lg border bg-bg-card p-3 text-sm text-text-primary transition-colors',
            'placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-bg-secondary resize-none',
            error ? 'border-status-danger-text focus:ring-status-danger-text' : 'border-border-primary',
            className,
          )}
          {...props}
        />
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

Textarea.displayName = 'Textarea';
