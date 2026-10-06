import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FeaturedBook } from '@/features/catalog/types';
import { Skeleton } from '@/shared/ui/Skeleton';
import { useLanguage } from '@/shared/i18n';
import { ROUTES } from '@/shared/constants';
import { cn } from '@/shared/lib';

interface FeaturedCarouselProps {
  books: FeaturedBook[];
  isLoading?: boolean;
}

export const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({
  books,
  isLoading = false,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { language, t } = useLanguage();

  if (isLoading) {
    return (
      <section className="pt-5 pb-3 px-5">
        <div className="flex items-center justify-between mb-3">
          <Skeleton width={120} height={22} className="rounded" />
          <Skeleton width={70} height={16} className="rounded" />
        </div>
        <Skeleton height={200} className="rounded-3xl" />
      </section>
    );
  }

  if (books.length === 0) return null;

  const sectionTitle = language === 'am' ? 'ልዩ ምርጫዎች' : 'Featured Books';
  const seeAllLabel = language === 'am' ? 'ሁሉንም እይ' : 'See All';
  const newEditionLabel = language === 'am' ? 'አዲስ እትም' : 'New Edition';

  return (
    <section className="pt-5 pb-3">
      <div className="px-5 flex items-center justify-between mb-3">
        <h2 className="text-[18px] font-bold text-text-primary">{sectionTitle}</h2>
        <Link
          to={ROUTES.CATALOG.ROOT}
          className="text-[13px] font-semibold text-accent-500 hover:text-brand-500 transition-colors"
        >
          {seeAllLabel}
        </Link>
      </div>

      {/* Peek carousel */}
      <div
        className="flex gap-4 overflow-x-auto px-5 no-scrollbar snap-x snap-mandatory"
        onScroll={(e) => {
          const el = e.currentTarget;
          const idx = Math.round(el.scrollLeft / (el.clientWidth * 0.75));
          setActiveIndex(Math.min(idx, books.length - 1));
        }}
      >
        {books.map((book, i) => (
          <Link
            key={book.id}
            to={ROUTES.CATALOG.DETAIL(book.id)}
            className={cn(
              'shrink-0 snap-center rounded-3xl overflow-hidden relative shadow-md bg-bg-secondary',
              i === 0 || i === books.length - 1
                ? 'w-[275px] aspect-[16/11]'
                : 'w-[275px] aspect-[16/11]',
              i !== activeIndex && 'opacity-90',
            )}
            style={{ aspectRatio: '16/11' }}
            aria-label={book.title[language]}
          >
            {/* Background image */}
            <img
              src={book.coverUrl}
              alt={book.title[language]}
              className="w-full h-full object-cover"
              loading="lazy"
            />

            {/* Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />

            {/* Top badge */}
            <div className="absolute top-3.5 left-3.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-bold text-brand-600 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" aria-hidden="true" />
                ✦ {book.featuredLabel ? book.featuredLabel[language] : newEditionLabel}
              </span>
            </div>

            {/* Bottom info */}
            <div className="absolute bottom-3.5 inset-x-3.5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-white/90 text-[12px] font-medium drop-shadow">
                  {book.author[language]}
                </span>
                {book.discountPercent && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white font-bold text-[10px] shadow border border-white/30">
                    -{book.discountPercent}% {t('catalog.fewLeft') === 'Few Left' ? 'Off' : 'ቅናሽ'}
                  </span>
                )}
              </div>
              <h3 className="text-white font-bold text-[15px] leading-tight drop-shadow">
                {book.title[language]}
              </h3>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-white font-extrabold text-[13px] drop-shadow">
                  {book.price.toLocaleString()} {language === 'am' ? 'ብር' : 'ETB'}
                </span>
                {book.originalPrice && (
                  <span className="text-white/60 line-through text-[11px]">
                    {book.originalPrice.toLocaleString()}
                  </span>
                )}
                <span className="text-white/75 text-[10.5px] ml-1">
                  • {language === 'am' ? 'በመደብር' : 'In-store'}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Dot indicators */}
      {books.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-3.5" aria-hidden="true">
          {books.map((_, i) => (
            <span
              key={i}
              className={cn(
                'rounded-full transition-all duration-300',
                i === activeIndex
                  ? 'w-4 h-1.5 bg-brand-500'
                  : 'w-1.5 h-1.5 bg-border-strong',
              )}
            />
          ))}
        </div>
      )}
    </section>
  );
};
