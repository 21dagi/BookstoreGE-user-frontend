import React from 'react';
import { useOnlineStatus } from '@/shared/hooks';
import { Icon } from '@/shared/ui/Icon';
import { useLanguage } from '@/shared/i18n';

export const OfflineBanner: React.FC = () => {
  const isOnline = useOnlineStatus();
  const { t } = useLanguage();

  if (isOnline) return null;

  return (
    <aside
      aria-live="polite"
      className="sticky top-0 z-40 flex items-center justify-center gap-2 bg-status-warning-bg text-status-warning-text px-4 py-2 text-xs font-semibold border-b border-status-warning-border select-none"
    >
      <Icon name="WifiOff" size={14} />
      <span>{t('common.offlineTitle')} — {t('common.offlineMessage')}</span>
    </aside>
  );
};
