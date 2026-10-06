import React, { useEffect } from 'react';
import { cn } from '@/shared/lib';
import { Icon } from '@/shared/ui/Icon';

export interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  showHandle?: boolean;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className,
  showHandle = true,
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
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-bg-overlay backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Sheet panel */}
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'relative z-10 w-full max-h-[90vh] flex flex-col rounded-t-2xl bg-bg-card border-t border-border-subtle shadow-xl pb-safe animate-in slide-in-from-bottom duration-200',
          className,
        )}
      >
        {showHandle && (
          <div className="flex justify-center pt-3 pb-1 cursor-grab">
            <div className="h-1.5 w-10 rounded-full bg-border-strong" />
          </div>
        )}
        {title && (
          <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle">
            <h2 className="text-base font-bold text-text-primary">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-secondary min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Close sheet"
            >
              <Icon name="X" size={20} />
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </div>
    </div>
  );
};
