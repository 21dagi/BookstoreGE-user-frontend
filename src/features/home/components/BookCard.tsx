import React from 'react';
import { Link } from 'react-router-dom';
import { Book } from '@/features/catalog/types';
import { useLanguage } from '@/shared/i18n';
import { ROUTES } from '@/shared/constants';
import { Icon } from '@/shared/ui/Icon';
import { Skeleton } from '@/shared/ui/Skeleton';
import { cn } from '@/shared/lib';

interface BookCardProps {
  book: Book;
  onToggleSaved?: (id: string) => void;
  className?: string;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onToggleSaved, className }) => {
  const { language } = useLanguage();

  return (
    <article className={cn('flex flex-col group', className)}>
      <Link
        to={ROUTES.CATALOG.DETAIL(book.id)}
        className="relative w-full aspect-square rounded-2xl overflow-hidden bg-bg-card shadow-[0_4px_16px_rgba(0,0,0,0.06)] border border-border-subtle mb-2.5 block"
        aria-label={book.title[language]}
      >
        {book.coverUrl ? (
          <img
            src={book.coverUrl}
            alt={book.title[language]}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-brand-50 text-brand-600">
            <Icon name="Book" size={36} />
          </div>
        )}

        {/* Discount badge */}
        {book.discountPercent && (
          <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-brand-500 text-white text-[10px] font-bold shadow border border-dashed border-brand-300">
            {book.discountLabel ? book.discountLabel[language] : `-${book.discountPercent}%`}
          </span>
        )}

        {/* Save bookmark */}
        {onToggleSaved && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onToggleSaved(book.id);
            }}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-text-secondary hover:text-brand-500 shadow transition-colors"
            aria-label={book.isSaved ? 'Remove from saved' : 'Save book'}
          >
            <Icon
              name={book.isSaved ? 'Bookmark' : 'BookmarkPlus'}
              size={16}
              className={cn(book.isSaved && 'fill-brand-500 text-brand-500')}
            />
          </button>
        )}
      </Link>

      <h3 className="font-bold text-[13px] text-text-primary leading-snug line-clamp-1">
        {book.title[language]}
      </h3>
      <p className="text-[11px] text-text-secondary mt-0.5 truncate">
        {book.author[language]}
      </p>
      <div className="mt-1 flex items-baseline gap-1.5">
        <span className="text-[12.5px] font-extrabold text-brand-500">
          {book.price.toLocaleString()} {language === 'am' ? 'ብር' : 'ETB'}
        </span>
        {book.originalPrice && (
          <span className="text-[10.5px] text-text-muted line-through">
            {book.originalPrice.toLocaleString()}
          </span>
        )}
      </div>
    </article>
  );
};

interface BookCardSkeletonProps {
  count?: number;
  className?: string;
}

export const BookCardSkeleton: React.FC<BookCardSkeletonProps> = ({ count = 3, className }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className={cn('flex flex-col gap-2', className ?? 'shrink-0 w-[140px]')}>
        <Skeleton className="w-full aspect-square rounded-2xl" />
        <Skeleton width={100} height={14} className="rounded" />
        <Skeleton width={70} height={12} className="rounded" />
        <Skeleton width={60} height={14} className="rounded" />
      </div>
    ))}
  </>
);
