import React from 'react';
import { cn } from '@/shared/lib';
import { BookCategory } from '@/features/catalog/types';
import { Skeleton } from '@/shared/ui/Skeleton';
import { useLanguage } from '@/shared/i18n';

interface CategoryChipsProps {
  categories: BookCategory[];
  activeCategoryId: string;
  onSelect: (id: string) => void;
  isLoading?: boolean;
}

export const CategoryChips: React.FC<CategoryChipsProps> = ({
  categories,
  activeCategoryId,
  onSelect,
  isLoading = false,
}) => {
  const { language } = useLanguage();

  if (isLoading) {
    return (
      <div className="flex gap-2.5 overflow-x-auto px-5 py-2 no-scrollbar">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} width={100} height={36} className="rounded-full shrink-0" />
        ))}
      </div>
    );
  }

  return (
    <section className="py-2" aria-label="Book categories">
      <div className="flex gap-2.5 overflow-x-auto px-5 no-scrollbar items-center">
        {categories.map((cat) => {
          const isActive = activeCategoryId === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => onSelect(isActive ? '' : cat.id)}
              className={cn(
                'shrink-0 px-4 py-2 rounded-full text-[13px] font-semibold flex items-center gap-1.5 min-h-[40px] active:scale-95 transition-all border select-none whitespace-nowrap',
                isActive
                  ? 'bg-brand-50 border-brand-200 text-brand-600 shadow-sm'
                  : 'bg-bg-card border-border-subtle text-text-secondary hover:text-text-primary shadow-sm',
              )}
            >
              <span className="text-base leading-none">{cat.emoji}</span>
              <span>{cat.name[language]}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
