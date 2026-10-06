import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/shared/i18n';
import { ROUTES } from '@/shared/constants';
import { ErrorState } from '@/shared/ui/ErrorState';
import { telegramAdapter } from '@/shared/telegram';
import { cn } from '@/shared/lib';
import {
  useCatalogCategoriesQuery,
  useFeaturedBooksQuery,
  useTrendingBooksQuery,
  useToggleSavedMutation,
} from '@/features/catalog/api';
import { CatalogCard, CatalogCardSkeleton, SpotlightHero } from '@/features/catalog/components';
import { Avatar } from '@/shared/ui/Avatar';

type Segment = 'books' | 'sacred_items';

const CatalogPage: React.FC = () => {
  const { language, changeLanguage } = useLanguage();
  const user = telegramAdapter.getUser();
  const displayName = user?.first_name ?? 'ቴዎድሮስ';

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSegment, setActiveSegment] = useState<Segment>('books');
  const [activeCategoryId, setActiveCategoryId] = useState('all');

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
    if (activeSegment === 'sacred_items') return b.itemType === 'sacred_item';
    if (activeSegment === 'books') return b.itemType !== 'sacred_item';
    return true;
  }).filter((b) => {
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

  const t = {
    booksTab: language === 'am' ? 'መጻሕፍት' : 'Books',
    sacredTab: language === 'am' ? 'ንዋየ ቅድሳት' : 'Sacred Items',
    gridTitle: language === 'am' ? 'የተመረጡ መጻሕፍትና ንዋያተ ቅድሳት' : 'Featured Books & Sacred Items',
    inStoreOnly: language === 'am' ? 'በቦታው ብቻ' : 'In-Store Only',
    pickup: language === 'am' ? 'ትዕዛዝዎ በቅድስት ሥላሴ ካቴድራል መደብር በአካል ይዘጋጃል (In-Store Pickup Only)' : 'Your order will be prepared at Holy Trinity Cathedral Store (In-Store Pickup Only)',
    allCount: language === 'am' ? 'ሁሉም' : 'All',
    searchPlaceholder: language === 'am' ? 'ርዕስ፣ ደራሲ ወይም በርዕሰ ጉዳይ ይፈልጉ...' : 'Search by title, author...',
    storeSubtitle: language === 'am' ? 'ቅድስት ሥላሴ መደብር' : 'Holy Trinity Store',
  };

  return (
    <div className="w-full bg-[#F8F7F5] min-h-screen flex flex-col pb-20">

      {/* ── Sticky Header ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#F8F7F5]/90 backdrop-blur-md border-b border-[#EFEAE3]/70 px-5 pt-4 pb-2">
        <div className="flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-50 border border-orange-200/70 flex items-center justify-center text-[#7a2330] shadow-sm">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <h1 className="text-[17px] font-bold text-[#241E20] leading-tight">{t.booksTab}</h1>
                <span className="text-[11px] font-semibold text-[#A39A9D]">· Books</span>
              </div>
              <span className="text-[11px] text-[#7A7073] leading-tight mt-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {t.storeSubtitle}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleLanguageToggle}
              className="px-2 py-1 rounded-full text-[11px] font-bold border border-[#ECE7E1] bg-white text-[#7a2330] shadow-sm active:scale-95 transition-transform"
              aria-label="Toggle language"
            >
              {language === 'am' ? 'EN' : 'አማ'}
            </button>
            <button
              aria-label="Search"
              id="catalog-search-btn"
              onClick={() => setSearchOpen((v) => !v)}
              className="w-9 h-9 rounded-full bg-white shadow-sm border border-[#ECE7E1] flex items-center justify-center text-[#241E20] active:scale-95 transition-transform"
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
            </button>
            <Link
              to={ROUTES.CART.ROOT}
              aria-label="Cart"
              className="relative w-9 h-9 rounded-full bg-white shadow-sm border border-[#ECE7E1] flex items-center justify-center text-[#241E20] active:scale-95 transition-transform"
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#7a2330] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm border-2 border-white">
                2
              </span>
            </Link>
            <div className="relative pl-0.5">
              <Avatar name={displayName} src={user?.photo_url} size="sm" />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
            </div>
          </div>
        </div>

        {/* Search input */}
        {searchOpen && (
          <div className="mt-2.5 pb-1">
            <div className="relative w-full">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A39A9D]" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input
                autoFocus
                type="search"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-9 rounded-xl bg-white border border-[#EBE5DE] text-[#241E20] placeholder:text-[#A39A9D] text-[13px] font-medium focus:outline-none focus:border-[#7a2330]/50 shadow-sm transition-all"
              />
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 flex flex-col pb-4">

        {/* ── Segment Tabs: Books / Sacred Items ─────────────────── */}
        <section className="px-5 pt-3 pb-1">
          <div className="p-1 rounded-2xl bg-[#EFEAE2] flex items-center gap-1 shadow-inner border border-[#E6DFD6]">
            <button
              id="segment-books"
              onClick={() => setActiveSegment('books')}
              className={cn(
                'flex-1 py-2 px-3 rounded-xl text-[13px] flex items-center justify-center gap-1.5 transition-all',
                activeSegment === 'books'
                  ? 'bg-[#7A2330] text-white font-bold shadow-[0_2px_8px_rgba(122,35,48,0.28)]'
                  : 'bg-[#FAF6F2] hover:bg-white text-[#2A2326] font-medium border border-[#EAE2D8]/80 active:scale-[0.98]',
              )}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
              <span>{t.booksTab}</span>
            </button>
            <button
              id="segment-sacred"
              onClick={() => setActiveSegment('sacred_items')}
              className={cn(
                'flex-1 py-2 px-3 rounded-xl text-[13px] flex items-center justify-center gap-1.5 transition-all',
                activeSegment === 'sacred_items'
                  ? 'bg-[#7A2330] text-white font-bold shadow-[0_2px_8px_rgba(122,35,48,0.28)]'
                  : 'bg-[#FAF6F2] hover:bg-white text-[#2A2326] font-medium border border-[#EAE2D8]/80 active:scale-[0.98]',
              )}
            >
              <span className="text-[#B2782A] text-[15px]">⛪</span>
              <span>{t.sacredTab}</span>
            </button>
          </div>
        </section>

        {/* ── Spotlight Hero ──────────────────────────────────────── */}
        <section className="px-5 pt-3 pb-2">
          {isLoading ? (
            <div className="w-full aspect-[16/10] rounded-3xl bg-[#F0E9E0] animate-pulse" />
          ) : featuredBook ? (
            <SpotlightHero
              book={featuredBook}
              language={language}
              onToggleSaved={(id) => toggleSaved.mutate(id)}
            />
          ) : null}
        </section>

        {/* ── Sub-category filter chips ───────────────────────────── */}
        <section className="py-2.5">
          <div className="flex gap-2 overflow-x-auto px-5 no-scrollbar items-center">
            {/* All chip */}
            <button
              id="chip-all"
              onClick={() => setActiveCategoryId('all')}
              className={cn(
                'shrink-0 px-3.5 py-1.5 rounded-full font-bold text-[12px] flex items-center gap-1 shadow-sm transition-all',
                activeCategoryId === 'all'
                  ? 'bg-[#7a2330] text-white'
                  : 'bg-white border border-[#E5DDD2] text-[#4A3F43] hover:text-[#7a2330] font-medium shadow-sm',
              )}
            >
              <span>{t.allCount}</span>
              <span className={cn(
                'text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-0.5',
                activeCategoryId === 'all' ? 'bg-white/20' : 'bg-[#F0E9E0] text-[#7a2330]',
              )}>
                {allBooks.length}
              </span>
            </button>

            {/* Category chips */}
            {allCategories.filter((c) => c.id !== 'all').map((cat) => (
              <button
                key={cat.id}
                id={`chip-${cat.id}`}
                onClick={() => setActiveCategoryId(cat.id)}
                className={cn(
                  'shrink-0 px-3.5 py-1.5 rounded-full text-[12px] flex items-center gap-1.5 transition-all',
                  activeCategoryId === cat.id
                    ? 'bg-[#7a2330] text-white font-bold shadow-sm'
                    : 'bg-white border border-[#E5DDD2] text-[#4A3F43] hover:text-[#7a2330] font-medium shadow-sm',
                )}
              >
                {cat.emoji && <span>{cat.emoji}</span>}
                <span>{cat.name[language]}</span>
              </button>
            ))}
          </div>
        </section>

        {/* ── 2-Column Grid ───────────────────────────────────────── */}
        <section className="px-4 pt-2 pb-2">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#5c0b1c]" />
              <h3 className="text-[17px] font-bold text-[#241E20]">{t.gridTitle}</h3>
            </div>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-orange-100/70 text-[#B2782A] border border-orange-200/50">
              {t.inStoreOnly}
            </span>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 gap-3.5">
              {Array.from({ length: 4 }).map((_, i) => (
                <CatalogCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="text-center py-10 text-[#A39A9D] text-sm">
              {language === 'am' ? 'ምንም አልተገኘም' : 'Nothing found'}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3.5" id="books-grid">
              {filteredBooks.map((book) => (
                <CatalogCard
                  key={book.id}
                  book={book}
                  onToggleSaved={(id) => toggleSaved.mutate(id)}
                />
              ))}
            </div>
          )}
        </section>

        {/* ── In-Store Pickup Banner ──────────────────────────────── */}
        <section className="px-5 mt-3 mb-1">
          <div className="bg-white border border-[#EEE8E2] rounded-2xl p-3 flex items-center gap-2.5 shadow-sm">
            <span className="w-7 h-7 rounded-full bg-orange-100/70 flex items-center justify-center text-[15px] shrink-0">
              📦
            </span>
            <p className="text-[11.5px] text-[#7A7073] leading-snug">
              {language === 'am' ? (
                <>
                  ትዕዛዝዎ በ<span className="font-semibold text-[#241E20]">ቅድስት ሥላሴ ካቴድራል መደብር</span> በአካል ይዘጋጃል (In-Store Pickup Only)
                </>
              ) : (
                <>
                  Your order is prepared at <span className="font-semibold text-[#241E20]">Holy Trinity Cathedral Store</span> (In-Store Pickup Only)
                </>
              )}
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CatalogPage;
