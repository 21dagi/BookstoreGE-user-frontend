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
    <section className="px-5 mt-3">
      <div className="bg-bg-card rounded-2xl px-4 py-3 border border-border-subtle shadow-card flex items-center justify-between">
        {/* Left: Icon + balance info */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-accent-500 shrink-0 shadow-sm">
            <Icon name="Wallet" size={22} />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-medium text-text-secondary">{balanceLabel}</span>
              <span
                className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0"
                aria-hidden="true"
              />
            </div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-[20px] font-extrabold text-text-primary leading-none tabular-nums">
                {formattedBalance}
              </span>
              <span className={cn('text-[12px] font-bold', 'text-accent-500')}>
                {currencyLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Deposit CTA */}
        <Link
          to={ROUTES.WALLET.DEPOSIT}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-brand-500 hover:bg-brand-600 text-white text-[12px] font-bold shadow-sm active:scale-95 transition-all shrink-0 min-h-[36px]"
          aria-label={t('wallet.deposit')}
        >
          <Icon name="Plus" size={16} />
          <span>{depositLabel}</span>
        </Link>
      </div>
    </section>
  );
};
