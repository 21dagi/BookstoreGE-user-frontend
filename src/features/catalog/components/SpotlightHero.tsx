import React from 'react';
import { Link } from 'react-router-dom';
import { FeaturedBook } from '@/features/catalog/types';
import { ROUTES } from '@/shared/constants';
import { cn } from '@/shared/lib';

interface SpotlightHeroProps {
  book: FeaturedBook;
  onToggleSaved?: (id: string) => void;
  language?: 'am' | 'en';
}

export const SpotlightHero: React.FC<SpotlightHeroProps> = ({
  book,
  onToggleSaved,
  language = 'am',
}) => {
  const inStock = book.availability === 'in_stock';

  return (
    <Link
      to={ROUTES.CATALOG.DETAIL(book.id)}
      className="group relative rounded-3xl overflow-hidden bg-white border border-[#E8DFC8]/70 shadow-[0_10px_28px_-8px_rgba(92,11,28,0.12)] cursor-pointer active:scale-[0.98] transition-all duration-300 block"
    >
      {/* Hero image */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#24171B]">
        {book.coverUrl ? (
          <img
            alt={book.title[language]}
            src={book.coverUrl}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl bg-[#24171B]">📖</div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A0E13]/95 via-[#1A0E13]/35 to-transparent" />

        {/* Top row: featured label + save */}
        <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between">
          {book.featuredLabel && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5c0b1c]/90 text-white backdrop-blur-md text-[11px] font-bold tracking-wide shadow-[0_1px_3px_rgba(0,0,0,0.18)] border border-dashed border-[rgba(255,237,213,0.85)]">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              {book.featuredLabel[language]}
            </span>
          )}
          <button
            aria-label="Save book"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleSaved?.(book.id);
            }}
            className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white/90 hover:text-white flex items-center justify-center transition-colors ml-auto"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill={book.isSaved ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </button>
        </div>

        {/* Bottom: publisher + title */}
        <div className="absolute bottom-3 inset-x-4 flex flex-col text-white">
          <div className="flex items-center gap-1.5 text-amber-200/90 text-[11px] font-medium mb-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-amber-400">
              <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            <span>
              {book.publisher?.[language] ?? book.author[language]}
              {book.pageCount ? ` • ${book.pageCount} ቅጾች` : ''}
            </span>
          </div>
          <h2 className="text-[19px] font-extrabold leading-snug drop-shadow-sm text-white">
            {book.title[language]}
          </h2>
        </div>
      </div>

      {/* Price row */}
      <div className="px-4 py-3 bg-gradient-to-r from-stone-50 via-white to-stone-50 flex items-center justify-between border-t border-[#F0EAE1]">
        <div className="flex items-center gap-2">
          <span className="text-[18px] font-extrabold text-[#7a2330]">
            {book.price.toLocaleString()} ETB
          </span>
          {book.originalPrice && book.originalPrice > book.price && (
            <span className="text-[12px] text-text-muted line-through font-medium">
              {book.originalPrice.toLocaleString()} ETB
            </span>
          )}
          {book.discountPercent && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              -{book.discountPercent}%
            </span>
          )}
        </div>
        <div className={cn(
          'flex items-center gap-1.5 text-[11.5px] font-semibold px-2.5 py-1 rounded-full border',
          inStock
            ? 'text-emerald-700 bg-emerald-50/80 border-emerald-100'
            : 'text-amber-700 bg-amber-50/80 border-amber-100',
        )}>
          <span className={cn('w-1.5 h-1.5 rounded-full animate-pulse', inStock ? 'bg-emerald-500' : 'bg-amber-500')} />
          <span>{inStock ? 'በመደብር አለ' : 'ውሱን'}</span>
        </div>
      </div>
    </Link>
  );
};
