import React from 'react';
import { useLanguage } from '@/shared/i18n';

export const PickupNote: React.FC = () => {
  const { language } = useLanguage();

  const storeLabel = language === 'am' ? 'ቅድስት ሥላሴ ካቴድራል መደብር' : 'Holy Trinity Cathedral Bookstore';

  return (
    <section className="px-5 mt-3 mb-4">
      <div className="bg-bg-card/80 border border-border-subtle rounded-2xl p-3 flex items-center gap-2.5 shadow-sm">
        <span className="w-7 h-7 rounded-full bg-brand-50 flex items-center justify-center text-[15px] shrink-0" aria-hidden="true">
          📦
        </span>
        <p className="text-[11px] text-text-secondary leading-snug">
          {language === 'am' ? (
            <>
              ትዕዛዝዎ በ<span className="font-semibold text-text-primary">{storeLabel}</span> በአካል ይዘጋጃል (In-Store Pickup Only)
            </>
          ) : (
            <>
              Your order will be prepared at <span className="font-semibold text-text-primary">{storeLabel}</span> (In-Store Pickup Only)
            </>
          )}
        </p>
      </div>
    </section>
  );
};
