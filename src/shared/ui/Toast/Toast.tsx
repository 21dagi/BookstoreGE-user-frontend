import React from 'react';
import { cn } from '@/shared/lib';
import { Icon, IconName } from '@/shared/ui/Icon';
import { useToastStore, ToastType } from './toastStore';

const toastConfig: Record<ToastType, { icon: IconName; colorClass: string }> = {
  success: { icon: 'CheckCircle2', colorClass: 'bg-status-success-bg text-status-success-text border-status-success-border' },
  error: { icon: 'AlertOctagon', colorClass: 'bg-status-danger-bg text-status-danger-text border-status-danger-border' },
  warning: { icon: 'AlertTriangle', colorClass: 'bg-status-warning-bg text-status-warning-text border-status-warning-border' },
  info: { icon: 'Info', colorClass: 'bg-status-info-bg text-status-info-text border-status-info-border' },
};

export const ToastContainer: React.FC = () => {
  const toasts = useToastStore((s) => s.toasts);
  const remove = useToastStore((s) => s.remove);

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed top-4 left-0 right-0 z-50 flex flex-col items-center gap-2 px-4 pointer-events-none"
    >
      {toasts.map((item) => {
        const conf = toastConfig[item.type];
        return (
          <div
            key={item.id}
            role="alert"
            className={cn(
              'pointer-events-auto flex items-center gap-2.5 max-w-md w-full rounded-xl border p-3.5 shadow-lg backdrop-blur-md animate-in slide-in-from-top duration-200 select-none',
              conf.colorClass,
            )}
          >
            <Icon name={conf.icon} size={18} />
            <p className="flex-1 text-xs font-semibold">{item.message}</p>
            <button
              type="button"
              onClick={() => remove(item.id)}
              className="p-1 rounded-md opacity-70 hover:opacity-100 min-h-[32px] min-w-[32px] flex items-center justify-center"
              aria-label="Dismiss toast"
            >
              <Icon name="X" size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
