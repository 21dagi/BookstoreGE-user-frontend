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
import { useCartStore } from '@/features/cart/store/cartStore';
import { Skeleton } from '@/shared/ui/Skeleton';

type Segment = 'books' | 'sacred_items';

const CatalogPage: React.FC = () => {
  const { language, changeLanguage } = useLanguage();
  const { resolvedTheme, toggleTheme } = useThemeStore();

  const [activeSegment, setActiveSegment] = useState<Segment>('books');
  const [activeCategoryId, setActiveCategoryId] = useState('all');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);

  const cartItems = useCartStore((s) => s.items);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

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

  // Filtered books for standard catalog view
  const filteredBooks = allBooks
    .filter((b) => {
      if (activeSegment === 'sacred_items') return b.itemType === 'sacred_item';
      return b.itemType !== 'sacred_item';
    })
    .filter((b) => {
      if (activeCategoryId === 'all') return true;
      return b.categoryId === activeCategoryId;
    });

  // Global searched books across the whole catalog
  const searchedBooks = allBooks.filter((b) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      b.title[language].toLowerCase().includes(q) ||
      b.author[language].toLowerCase().includes(q)
    );
  });

  const featuredBook = (featured.data ?? [])[0];
  const allCategories = categories.data ?? [];

  const t = {
    title: language === 'am' ? 'መደብር' : 'Store',
    booksTab: language === 'am' ? 'መጻሕፍት' : 'Books',
    sacredTab: language === 'am' ? 'ንዋየ ቅድሳት' : 'Properties & Sacred Items',
    allCount: language === 'am' ? 'ሁሉም' : 'All',
    searchPlaceholder: language === 'am' ? 'ርዕስ፣ ደራሲ ወይም ንዋይ ፈልግ...' : 'Search books, authors, items...',
    monthlyPick: language === 'am' ? 'የወሩ ምርጫ' : 'Monthly Pick',
    seeAll: language === 'am' ? 'ሁሉንም እይ' : 'See All',
    newEdition: language === 'am' ? 'አዲስ እትም' : 'New Edition',
  };

  return (
    <div className="w-full bg-bg-primary text-text-primary min-h-screen flex flex-col pb-24">

      {/* ── Prominent Sticky Header with Shadow ───────────────────────── */}
      <header className="sticky top-0 z-40 bg-bg-primary/95 backdrop-blur-md border-b border-border-subtle shadow-[0_2px_12px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] px-4 py-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0 shadow-sm border border-border-subtle">
              <img src="/app-logo.png" alt="የኰኵሐ ሃይማኖት ሰንበት ት/ቤት" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="text-[16px] font-extrabold text-text-primary leading-tight">
                {activeSegment === 'books' ? t.booksTab : t.sacredTab}
              </span>
              <span className="text-[10.5px] font-medium text-text-muted leading-none mt-0.5">
                {language === 'am' ? 'የኰኵሐ ሃይማኖት ሰንበት ት/ቤት' : 'Kokoha Haymanot'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Globe Language Button */}
            <button
              onClick={handleLanguageToggle}
              className="h-9 px-2.5 rounded-full bg-bg-card border border-border-subtle shadow-sm hover:border-brand-500/50 flex items-center gap-1.5 active:scale-95 transition-all text-text-primary"
              aria-label="Switch language"
            >
              <Icon name="Globe" size={15} className="text-brand-500 shrink-0" />
              <span className="text-[11.5px] font-bold tracking-tight">
                {language === 'am' ? 'አማ' : 'EN'}
              </span>
            </button>

            {/* Dark/Light Toggle */}
            <button
              onClick={toggleTheme}
              className="h-9 w-9 rounded-full bg-bg-card border border-border-subtle shadow-sm flex items-center justify-center text-text-primary active:scale-95 transition-all"
              aria-label="Toggle theme"
            >
              {resolvedTheme === 'dark' ? (
                <Icon name="Sun" size={17} className="text-amber-400" />
              ) : (
                <Icon name="Moon" size={17} className="text-brand-500" />
              )}
            </button>

            {/* Cart Link with Badge */}
            <Link
              to={ROUTES.CART.ROOT}
              className="relative h-9 w-9 rounded-full bg-bg-card border border-border-subtle shadow-sm flex items-center justify-center text-text-primary active:scale-95 transition-all"
              aria-label="Cart"
            >
              <Icon name="ShoppingBag" size={17} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 rounded-full bg-[#5c0b1c] text-white text-[10px] font-extrabold flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Search */}
            <button
              aria-label="Search"
              onClick={() => {
                if (searchOpen) {
                  setSearchOpen(false);
                  setSearchQuery('');
                } else {
                  setSearchOpen(true);
                }
              }}
              className={cn(
                'h-9 w-9 rounded-full border shadow-sm flex items-center justify-center transition-all active:scale-95',
                searchOpen
                  ? 'bg-[#5c0b1c] text-white border-[#5c0b1c]'
                  : 'bg-bg-card border-border-subtle text-text-primary'
              )}
            >
              <Icon name={searchOpen ? 'X' : 'Search'} size={17} />
            </button>

            {/* Notification bell */}
            <button
              onClick={() => setNotifOpen(true)}
              className="relative h-9 w-9 rounded-full bg-bg-card border border-border-subtle shadow-sm flex items-center justify-center text-text-primary active:scale-95 transition-transform"
              aria-label="Notifications"
            >
              <Icon name="Bell" size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#E5484D]" />
            </button>
          </div>
        </div>

        {/* Search Input Drawer */}
        {searchOpen && (
          <div className="mt-2.5 pt-1">
            <div className="relative w-full flex items-center">
              <Icon name="Search" size={16} className="absolute left-3.5 text-text-muted" />
              <input
                autoFocus
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-9 rounded-xl bg-bg-card border border-border-subtle text-text-primary placeholder:text-text-muted text-[13px] font-medium focus:outline-none focus:border-brand-500 shadow-sm transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 w-5 h-5 rounded-full bg-bg-secondary flex items-center justify-center text-text-muted hover:text-text-primary active:scale-90"
                >
                  <Icon name="X" size={12} />
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 flex flex-col pb-3">

        {/* ── Search Overlay Mode (Displays ONLY search results directly below search bar) ── */}
        {searchOpen ? (
          <section className="px-4 pt-3 pb-2 flex-1 flex flex-col gap-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Icon name="Search" size={15} className="text-brand-500" />
                <h2 className="text-[15px] font-bold text-text-primary">
                  {searchQuery ? (
                    language === 'am' ? `"${searchQuery}" የፍለጋ ውጤቶች` : `Results for "${searchQuery}"`
                  ) : (
                    language === 'am' ? 'የሚፈልጉትን መጽሐፍ ወይም ንዋይ ይጻፉ' : 'Type to search books or sacred items'
                  )}
                </h2>
              </div>
              <span className="text-[11.5px] font-semibold text-text-muted">
                {searchedBooks.length} {language === 'am' ? 'ውጤቶች' : 'results'}
              </span>
            </div>

            {searchedBooks.length === 0 ? (
              <div className="text-center py-16 text-text-muted flex flex-col items-center gap-2">
                <Icon name="SearchX" size={38} className="opacity-30 mb-1" />
                <span className="text-[14px] font-bold text-text-primary">
                  {language === 'am' ? 'ምንም መጽሐፍ አልተገኘም' : 'No items found'}
                </span>
                <span className="text-[12px] max-w-xs leading-relaxed">
                  {language === 'am'
                    ? 'እባክዎ የተለየ የደራሲ ወይም የመጽሐፍ ስም በመጻፍ እንደገና ይሞክሩ።'
                    : 'Try checking your spelling or search by different keywords.'}
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3.5">
                {searchedBooks.map((book) => (
                  <div key={book.id} className="w-full">
                    <BookCard
                      book={book}
                      onToggleSaved={(id) => toggleSaved.mutate(id)}
                    />
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : (
          <>
            {/* ── Main Segment Tabs: Books & Properties (Restored!) ───────── */}
            <section className="px-4 pt-3 pb-2">
              <div className="p-1 rounded-2xl bg-bg-card border border-border-subtle shadow-sm flex items-center gap-1.5">
                <button
                  onClick={() => setActiveSegment('books')}
                  className={cn(
                    'flex-1 py-2 px-3 rounded-xl text-[13px] font-bold flex items-center justify-center gap-2 transition-all duration-200',
                    activeSegment === 'books'
                      ? 'bg-gradient-to-r from-[#7a2330] to-[#9E2B3E] text-white shadow-md'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary font-semibold',
                  )}
                >
                  <Icon name="BookOpen" size={16} />
                  <span>{t.booksTab}</span>
                </button>
                <button
                  onClick={() => setActiveSegment('sacred_items')}
                  className={cn(
                    'flex-1 py-2 px-3 rounded-xl text-[13px] font-bold flex items-center justify-center gap-2 transition-all duration-200',
                    activeSegment === 'sacred_items'
                      ? 'bg-gradient-to-r from-[#7a2330] to-[#9E2B3E] text-white shadow-md'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary font-semibold',
                  )}
                >
                  <span className="text-base leading-none">⛪</span>
                  <span>{t.sacredTab}</span>
                </button>
              </div>
            </section>

            {/* ── Sub-Category Filter Chips ─────────────────────────────── */}
            <section className="py-1">
              <div className="flex gap-2 overflow-x-auto px-4 no-scrollbar items-center">
                <button
                  onClick={() => setActiveCategoryId('all')}
                  className={cn(
                    'shrink-0 px-3.5 py-1.5 rounded-full font-bold text-[12px] transition-all shadow-sm',
                    activeCategoryId === 'all'
                      ? 'bg-[#7a2330] text-white shadow-sm'
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
                      'shrink-0 px-3.5 py-1.5 rounded-full text-[12px] flex items-center gap-1.5 transition-all shadow-sm',
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

            {/* ── Monthly Pick (Featured in Books segment) ──────────────── */}
            {activeSegment === 'books' && !isLoading && featuredBook && (
              <section className="px-4 pt-2 pb-2">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-[16px] font-bold text-text-primary">{t.monthlyPick}</h2>
                </div>
                <Link
                  to={ROUTES.CATALOG.DETAIL(featuredBook.id)}
                  className="relative shrink-0 rounded-2xl overflow-hidden shadow-md bg-bg-secondary block"
                  style={{ aspectRatio: '16/10' }}
                  aria-label={featuredBook.title[language]}
                >
                  <img
                    src={featuredBook.coverUrl}
                    alt={featuredBook.title[language]}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />
                  <div className="absolute top-3.5 left-3.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10.5px] font-bold text-brand-600 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
                      ✦ {featuredBook.featuredLabel?.[language] ?? t.newEdition}
                    </span>
                  </div>
                  <div className="absolute bottom-3.5 inset-x-3.5">
                    <span className="text-white/80 text-[11.5px] font-medium drop-shadow">{featuredBook.author[language]}</span>
                    <h3 className="text-white font-bold text-[15px] leading-tight drop-shadow mt-0.5">{featuredBook.title[language]}</h3>
                    <span className="text-white font-extrabold text-[13px] drop-shadow mt-1 block">
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

            {/* ── Items Grid ────────────────────────────────────────────── */}
            <section className="px-4 pt-2 pb-2">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#7a2330]" />
                  <h2 className="text-[16px] font-bold text-text-primary">
                    {activeSegment === 'books' ? (language === 'am' ? 'የመጻሕፍት ዝርዝር' : 'All Books') : t.sacredTab}
                  </h2>
                </div>
                <span className="text-[11.5px] font-semibold text-text-muted">
                  {filteredBooks.length} {language === 'am' ? 'ዓይነት' : 'items'}
                </span>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-2 gap-3.5">
                  <BookCardSkeleton count={4} />
                </div>
              ) : filteredBooks.length === 0 ? (
                <div className="text-center py-12 text-text-muted flex flex-col items-center gap-2">
                  <Icon name="BookOpen" size={36} className="opacity-30" />
                  <span className="text-sm font-medium">{language === 'am' ? 'ምንም አልተገኘም' : 'No items found'}</span>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3.5">
                  {filteredBooks.map((book) => (
                    <div key={book.id} className="w-full">
                      <BookCard
                        book={book}
                        onToggleSaved={(id) => toggleSaved.mutate(id)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>

      <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} unreadCount={2} />
    </div>
  );
};

export default CatalogPage;
