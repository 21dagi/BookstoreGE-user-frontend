import React, { useEffect } from 'react';
import { cn } from '@/shared/lib';
import { Icon } from '@/shared/ui/Icon';

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-bg-overlay backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Dialog box */}
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'relative z-10 w-full max-w-sm rounded-2xl bg-bg-card p-6 shadow-xl border border-border-subtle animate-in zoom-in-95 duration-150',
          className,
        )}
      >
        <div className="flex items-center justify-between mb-3">
          {title && <h2 className="text-lg font-bold text-text-primary">{title}</h2>}
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-secondary min-h-[44px] min-w-[44px] flex items-center justify-center ml-auto"
            aria-label="Close dialog"
          >
            <Icon name="X" size={18} />
          </button>
        </div>
        {description && (
          <p className="text-sm text-text-secondary mb-4">{description}</p>
        )}
        <div>{children}</div>
      </div>
    </div>
  );
};
