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
        'p-1.5 -ml-2 rounded-lg text-text-primary hover:bg-bg-secondary min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors',
        className,
      )}
      aria-label={t('common.back')}
    >
      <Icon name="ChevronLeft" size={24} />
    </button>
  );
};
