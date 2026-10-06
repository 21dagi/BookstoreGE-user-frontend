import React from 'react';
import { cn } from '@/shared/lib';
import { Icon } from '@/shared/ui/Icon';

export interface StepItem {
  id: string | number;
  label?: string;
}

export interface StepperProps {
  steps: StepItem[];
  currentStepIndex: number;
  className?: string;
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStepIndex,
  className,
}) => {
  return (
    <div className={cn('w-full flex items-center justify-between py-2', className)}>
      {steps.map((step, idx) => {
        const isCompleted = idx < currentStepIndex;
        const isCurrent = idx === currentStepIndex;

        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors select-none',
                  isCompleted
                    ? 'bg-brand-500 text-white'
                    : isCurrent
                    ? 'bg-brand-500 text-white ring-4 ring-brand-100'
                    : 'bg-bg-tertiary text-text-muted',
                )}
              >
                {isCompleted ? <Icon name="Check" size={14} /> : idx + 1}
              </div>
              {step.label && (
                <span
                  className={cn(
                    'mt-1 text-[11px] font-medium',
                    isCurrent ? 'text-brand-500 font-bold' : 'text-text-muted',
                  )}
                >
                  {step.label}
                </span>
              )}
            </div>
            {idx < steps.length - 1 && (
              <div
                className={cn(
                  'flex-1 h-0.5 mx-2 transition-colors',
                  idx < currentStepIndex ? 'bg-brand-500' : 'bg-border-subtle',
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
