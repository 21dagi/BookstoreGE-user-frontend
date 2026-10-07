import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/shared/i18n';
import { ROUTES } from '@/shared/constants';
import { ErrorState } from '@/shared/ui/ErrorState';
import { cn } from '@/shared/lib';
import {
  useCatalogCategoriesQuery,
  useFeaturedBooksQuery,
  useTrendingBooksQuery,
  useToggleSavedMutation,
} from '@/features/catalog/api';
import { Icon } from '@/shared/ui/Icon';
import { useThemeStore } from '@/shared/theme';
import { NotificationPanel } from '@/shared/components/display/NotificationPanel';
import { BookCard, BookCardSkeleton } from '@/features/home/components/BookCard';
import { Skeleton } from '@/shared/ui/Skeleton';

const CatalogPage: React.FC = () => {
  const { language, changeLanguage } = useLanguage();
  const { resolvedTheme, toggleTheme } = useThemeStore();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryId, setActiveCategoryId] = useState('all');
  const [notifOpen, setNotifOpen] = useState(false);

  const categories = useCatalogCategoriesQuery();
  const featured = useFeaturedBooksQuery();
  const trending = useTrendingBooksQuery();
  const toggleSaved = useToggleSavedMutation();

  const isLoading = categories.isLoading || featured.isLoading || trending.isLoading;
  const hasError = categories.isError || featured.isError || trending.isError;

  const refetchAll = () => {
    categories.refetch();
    featured.refetch();
    trending.refetch();
  };

  const handleLanguageToggle = () => changeLanguage(language === 'am' ? 'en' : 'am');

  if (hasError) {
    return (
      <div className="px-5 pt-20">
        <ErrorState onRetry={refetchAll} />
      </div>
    );
  }

  const allBooks = trending.data ?? [];
  const filteredBooks = allBooks.filter((b) => {
    if (activeCategoryId === 'all') return true;
    return b.categoryId === activeCategoryId;
  }).filter((b) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      b.title[language].toLowerCase().includes(q) ||
      b.author[language].toLowerCase().includes(q)
    );
  });

  const featuredBook = (featured.data ?? [])[0];
  const allCategories = categories.data ?? [];

  const STORE_NAME = 'የኰኵሐ ሃይማኖት ሰንበት ት/ቤት';

  const t = {
    booksTab: language === 'am' ? 'መጻሕፍት' : 'Books',
    gridTitle: language === 'am' ? 'ሁሉም መጻሕፍት' : 'All Books',
    allCount: language === 'am' ? 'ሁሉም' : 'All',
    searchPlaceholder: language === 'am' ? 'ርዕስ፣ ደራሲ...' : 'Search title, author...',
    monthlyPick: language === 'am' ? 'የወሩ ምርጫ' : 'Monthly Pick',
    seeAll: language === 'am' ? 'ሁሉንም እይ' : 'See All',
    newEdition: language === 'am' ? 'አዲስ እትም' : 'New Edition',
  };

  return (
    <div className="w-full bg-bg-primary text-text-primary min-h-screen flex flex-col pb-24">

      {/* ── Compact Sticky Header ───────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-bg-primary/95 backdrop-blur-md border-b border-border-subtle px-4 pt-3 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg overflow-hidden shrink-0 border border-border-subtle">
              <img src="/app-logo.png" alt={STORE_NAME} className="w-full h-full object-cover" />
            </div>
            <span className="text-[15px] font-bold text-text-primary">{t.booksTab}</span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Language */}
            <button
              onClick={handleLanguageToggle}
              className="h-7 w-7 rounded-full bg-bg-card border border-border-subtle flex items-center justify-center shadow-sm active:scale-95 transition-transform"
              aria-label="Toggle language"
            >
              <span className="text-[10px] font-extrabold text-brand-500">{language === 'am' ? 'EN' : 'አማ'}</span>
            </button>

            {/* Theme */}
            <button
              onClick={toggleTheme}
              className="h-7 w-7 rounded-full bg-bg-card border border-border-subtle flex items-center justify-center shadow-sm active:scale-95 transition-all"
              aria-label="Toggle theme"
            >
              {resolvedTheme === 'dark'
                ? <Icon name="Sun" size={13} className="text-amber-400" />
                : <Icon name="Moon" size={13} className="text-brand-500" />
              }
            </button>

            {/* Search */}
            <button
              aria-label="Search"
              onClick={() => setSearchOpen((v) => !v)}
              className="h-7 w-7 rounded-full bg-bg-card border border-border-subtle flex items-center justify-center active:scale-95 transition-transform"
            >
              <Icon name="Search" size={14} />
            </button>

            {/* Notification bell */}
            <button
              onClick={() => setNotifOpen(true)}
              className="relative h-7 w-7 rounded-full bg-bg-card border border-border-subtle flex items-center justify-center active:scale-95 transition-transform"
              aria-label="Notifications"
            >
              <Icon name="Bell" size={14} />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#E5484D]" />
            </button>
          </div>
        </div>

        {/* Search input */}
        {searchOpen && (
          <div className="mt-2 pb-0.5">
            <div className="relative w-full">
              <Icon name="Search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                autoFocus
                type="search"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-8 rounded-xl bg-bg-card border border-border-subtle text-text-primary placeholder:text-text-muted text-[12px] focus:outline-none focus:border-brand-500/50 shadow-sm transition-all"
              />
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 flex flex-col pb-3">

        {/* ── Category filter chips ───────────────────────────────── */}
        <section className="py-2">
          <div className="flex gap-2 overflow-x-auto px-4 no-scrollbar items-center">
            <button
              onClick={() => setActiveCategoryId('all')}
              className={cn(
                'shrink-0 px-3 py-1 rounded-full font-bold text-[11px] transition-all shadow-sm',
                activeCategoryId === 'all'
                  ? 'bg-[#7a2330] text-white'
                  : 'bg-bg-card border border-border-subtle text-text-secondary hover:text-text-primary font-medium',
              )}
            >
              {t.allCount}
            </button>

            {allCategories.filter((c) => c.id !== 'all').map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategoryId(cat.id)}
                className={cn(
                  'shrink-0 px-3 py-1 rounded-full text-[11px] flex items-center gap-1 transition-all shadow-sm',
                  activeCategoryId === cat.id
                    ? 'bg-[#7a2330] text-white font-bold'
                    : 'bg-bg-card border border-border-subtle text-text-secondary hover:text-text-primary font-medium',
                )}
              >
                {cat.emoji && <span>{cat.emoji}</span>}
                <span>{cat.name[language]}</span>
              </button>
            ))}
          </div>
        </section>

        {/* ── Monthly Pick (same style as FeaturedCarousel card) ──── */}
        {!isLoading && featuredBook && (
          <section className="px-4 pb-2">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-[15px] font-bold text-text-primary">{t.monthlyPick}</h2>
            </div>
            <Link
              to={ROUTES.CATALOG.DETAIL(featuredBook.id)}
              className="relative shrink-0 rounded-2xl overflow-hidden shadow-md bg-bg-secondary block"
              style={{ aspectRatio: '16/11' }}
              aria-label={featuredBook.title[language]}
            >
              <img
                src={featuredBook.coverUrl}
                alt={featuredBook.title[language]}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />
              <div className="absolute top-3 left-3">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-bold text-brand-600 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
                  ✦ {featuredBook.featuredLabel?.[language] ?? t.newEdition}
                </span>
              </div>
              <div className="absolute bottom-3 inset-x-3">
                <span className="text-white/80 text-[11px] font-medium drop-shadow">{featuredBook.author[language]}</span>
                <h3 className="text-white font-bold text-[14px] leading-tight drop-shadow">{featuredBook.title[language]}</h3>
                <span className="text-white font-extrabold text-[12px] drop-shadow">
                  {featuredBook.price.toLocaleString()} {language === 'am' ? 'ብር' : 'ETB'}
                </span>
              </div>
            </Link>
          </section>
        )}

        {isLoading && (
          <section className="px-4 pb-2">
            <Skeleton height={180} className="rounded-2xl" />
          </section>
        )}

        {/* ── Grid: All Books (same style as Trending BookCard) ─────── */}
        <section className="px-4 pb-2">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-[15px] font-bold text-text-primary">{t.gridTitle}</h2>
            <span className="text-[11px] text-text-muted">{filteredBooks.length} {language === 'am' ? 'ዓይነት' : 'items'}</span>
          </div>

          {isLoading ? (
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
              <BookCardSkeleton count={4} />
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="text-center py-8 text-text-muted text-sm">
              {language === 'am' ? 'ምንም አልተገኘም' : 'Nothing found'}
            </div>
          ) : (
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
              {filteredBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onToggleSaved={(id) => toggleSaved.mutate(id)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} unreadCount={2} />
    </div>
  );
};

export default CatalogPage;
