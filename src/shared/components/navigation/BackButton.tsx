import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/shared/ui/Icon';
import { useLanguage } from '@/shared/i18n';
import { cn } from '@/shared/lib';

export interface BackButtonProps {
  onBack?: () => void;
  className?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({ onBack, className }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={cn(
        'w-9 h-9 rounded-full bg-bg-card border border-border-subtle shadow-sm text-text-primary hover:border-brand-500/50 flex items-center justify-center transition-all active:scale-95 shrink-0',
        className,
      )}
      aria-label={t('common.back')}
    >
      <Icon name="ChevronLeft" size={20} />
    </button>
  );
};
