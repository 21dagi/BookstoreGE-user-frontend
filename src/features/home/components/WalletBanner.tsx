import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@/shared/ui/Icon';
import { Skeleton } from '@/shared/ui/Skeleton';
import { useLanguage } from '@/shared/i18n';
import { ROUTES } from '@/shared/constants';
import { cn } from '@/shared/lib';

interface WalletBannerProps {
  balance?: number;
  isLoading?: boolean;
}

export const WalletBanner: React.FC<WalletBannerProps> = ({
  balance,
  isLoading = false,
}) => {
  const { language, t } = useLanguage();

  if (isLoading) {
    return (
      <div className="mx-5 mt-3">
        <Skeleton height={72} className="rounded-2xl" />
      </div>
    );
  }

  const formattedBalance = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(balance ?? 0);

  const currencyLabel = language === 'am' ? 'ብር' : 'ETB';
  const balanceLabel = language === 'am' ? 'የመደብር ቀሪ ሒሳብ' : 'Store Balance';
  const depositLabel = language === 'am' ? 'አስገባ' : 'Add';

  return (
    <section className="px-4 mt-2">
      <div className="bg-bg-card rounded-2xl px-3.5 py-2.5 border border-border-subtle shadow-card flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-accent-500 shrink-0">
            <Icon name="Wallet" size={18} />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-medium text-text-secondary">{balanceLabel}</span>
              <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse shrink-0" aria-hidden="true" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-[18px] font-extrabold text-text-primary leading-none tabular-nums">{formattedBalance}</span>
              <span className={cn('text-[11px] font-bold', 'text-accent-500')}>{currencyLabel}</span>
            </div>
          </div>
        </div>
        <Link
          to={ROUTES.WALLET.DEPOSIT}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-brand-500 hover:bg-brand-600 text-white text-[11px] font-bold shadow-sm active:scale-95 transition-all shrink-0"
          aria-label={t('wallet.deposit')}
        >
          <Icon name="Plus" size={14} />
          <span>{depositLabel}</span>
        </Link>
      </div>
    </section>
  );
};
