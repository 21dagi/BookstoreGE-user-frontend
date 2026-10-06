import React from 'react';
import { Link } from 'react-router-dom';
import { Book } from '@/features/catalog/types';
import { ROUTES } from '@/shared/constants';
import { cn } from '@/shared/lib';

interface CatalogCardProps {
  book: Book;
  onToggleSaved?: (id: string) => void;
}

function getBadgeStyle(badge?: string) {
  if (!badge) return '';
  if (badge === 'new') return 'bg-emerald-700 text-white';
  if (badge === 'handmade') return 'bg-[#B2782A] text-white';
  return 'bg-[#7a2330] text-white'; // discount / default
}

function getPublisherIcon(itemType?: string) {
  return itemType === 'sacred_item' ? '⛪' : '🏪';
}

function getAvailabilityLabel(availability: Book['availability']) {
  const map: Record<Book['availability'], { am: string; en: string; color: string }> = {
    in_stock: { am: 'በመደብር አለ', en: 'In Stock', color: 'text-emerald-700' },
    few_left: { am: 'ውሱን', en: 'Few Left', color: 'text-amber-700' },
    out_of_stock: { am: 'አልቋል', en: 'Out of Stock', color: 'text-red-600' },
    unavailable: { am: 'አይገኝም', en: 'Unavailable', color: 'text-text-muted' },
  };
  return map[availability] ?? map['in_stock'];
}

function getAvailabilityDotColor(availability: Book['availability']) {
  const map: Record<Book['availability'], string> = {
    in_stock: 'bg-emerald-500',
    few_left: 'bg-amber-500',
    out_of_stock: 'bg-red-500',
    unavailable: 'bg-gray-400',
  };
  return map[availability] ?? 'bg-emerald-500';
}

export const CatalogCard: React.FC<CatalogCardProps> = ({ book, onToggleSaved }) => {
  const lang = 'am'; // TODO: wire to language store
  const avail = getAvailabilityLabel(book.availability);
  const badgeLabel = book.badgeLabel ? book.badgeLabel[lang] : undefined;

  return (
    <article className="bg-white rounded-2xl p-3 shadow-[0_4px_18px_rgba(0,0,0,0.04)] border border-[#EAE2D8] flex flex-col justify-between group hover:shadow-[0_8px_24px_rgba(92,11,28,0.08)] hover:border-[#7a2330]/25 active:scale-[0.98] cursor-pointer transition-all duration-200">
      <Link to={ROUTES.CATALOG.DETAIL(book.id)} className="flex flex-col flex-1 min-w-0">
        {/* Cover image */}
        <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-[#F5EFEB] mb-2.5 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
          {book.coverUrl ? (
            <img
              alt={book.title[lang]}
              src={book.coverUrl}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl">📖</div>
          )}
          {/* Badge */}
          {badgeLabel && (
            <span
              className={cn(
                'absolute top-2 left-2 px-1.5 py-0.5 rounded-md text-[10px] font-bold shadow-[0_1px_3px_rgba(0,0,0,0.18)] border border-dashed border-white/30',
                getBadgeStyle(book.badge),
              )}
            >
              {badgeLabel}
            </span>
          )}
          {/* Save button */}
          <button
            aria-label="Save book"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleSaved?.(book.id);
            }}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center text-text-secondary hover:text-[#7a2330] shadow-sm transition-colors"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill={book.isSaved ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="2"
              className={book.isSaved ? 'text-[#7a2330]' : ''}
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </button>
        </div>

        {/* Publisher row */}
        <div className="flex items-center gap-1 text-[11px] text-text-muted mb-1">
          <span className="text-[#B2782A] text-[12px]">{getPublisherIcon(book.itemType)}</span>
          <span className="truncate">{book.publisher?.[lang] ?? book.author[lang]}</span>
        </div>

        {/* Title */}
        <h4 className="font-bold text-[13.5px] text-[#241E20] leading-[1.35] line-clamp-2 group-hover:text-[#7a2330] transition-colors flex-1">
          {book.title[lang]}
        </h4>
      </Link>

      {/* Price row */}
      <div className="pt-2.5 mt-2.5 border-t border-[#F2ECE4] flex items-baseline justify-between">
        <div className="flex items-baseline gap-1.5">
          <span className="text-[14px] font-extrabold text-[#7a2330]">
            {book.price.toLocaleString()} ETB
          </span>
          {book.originalPrice && book.originalPrice > book.price && (
            <span className="text-[10.5px] text-text-muted line-through font-medium">
              {book.originalPrice.toLocaleString()} ETB
            </span>
          )}
        </div>
        <span className={cn('text-[10px] font-semibold flex items-center gap-1 shrink-0', avail.color)}>
          <span className={cn('w-1.5 h-1.5 rounded-full', getAvailabilityDotColor(book.availability))} />
          {avail[lang]}
        </span>
      </div>
    </article>
  );
};

export const CatalogCardSkeleton: React.FC = () => (
  <article className="bg-white rounded-2xl p-3 border border-[#EAE2D8] animate-pulse">
    <div className="w-full aspect-[4/3] rounded-xl bg-[#F0E9E0] mb-2.5" />
    <div className="h-3 w-1/2 bg-[#F0E9E0] rounded mb-1.5" />
    <div className="h-4 w-3/4 bg-[#F0E9E0] rounded mb-1" />
    <div className="h-3.5 w-full bg-[#F0E9E0] rounded mt-2.5" />
  </article>
);
