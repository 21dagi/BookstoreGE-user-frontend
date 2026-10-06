import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/shared/i18n';
import { ErrorState } from '@/shared/ui/ErrorState';
import { ROUTES } from '@/shared/constants';
import { useHomeData } from '../hooks/useHomeData';
import { HomeHeader } from '../components/HomeHeader';
import { CategoryChips } from '../components/CategoryChips';
import { WalletBanner } from '../components/WalletBanner';
import { FeaturedCarousel } from '../components/FeaturedCarousel';
import { BookCard, BookCardSkeleton } from '../components/BookCard';
import { PickupNote } from '../components/PickupNote';

const HomePage: React.FC = () => {
  const { language, changeLanguage } = useLanguage();
  const {
    categories,
    featuredBooks,
    trendingBooks,
    activeCategoryId,
    setActiveCategoryId,
    isLoading,
    hasError,
    refetchAll,
    handleToggleSaved,
  } = useHomeData();

  const handleLanguageToggle = () => {
    changeLanguage(language === 'am' ? 'en' : 'am');
  };

  if (hasError) {
    return (
      <div className="px-5 pt-20">
        <ErrorState onRetry={refetchAll} />
      </div>
    );
  }

  const trendingLabel = language === 'am' ? 'ተወዳጅ መጻሕፍት' : 'Trending Books';
  const seeAllLabel = language === 'am' ? 'ሁሉንም እይ' : 'See All';
  const headlineLabel = language === 'am' ? 'ዛሬ ምን ማንበብ ይፈልጋሉ?' : 'What will you read today?';

  return (
    <div className="w-full pb-20 bg-bg-primary min-h-screen">
      {/* Header: greeting + language + notifications */}
      <HomeHeader
        unreadCount={2}
        onLanguageToggle={handleLanguageToggle}
      />

      {/* Big headline */}
      <section className="px-5 pt-4 pb-3">
        <h1 className="text-[26px] font-extrabold text-text-primary leading-[1.25] tracking-tight max-w-[280px]">
          {headlineLabel}
        </h1>
      </section>

      {/* Category filter pills */}
      <CategoryChips
        categories={categories}
        activeCategoryId={activeCategoryId}
        onSelect={setActiveCategoryId}
        isLoading={isLoading}
      />

      {/* Wallet balance + deposit CTA */}
      <WalletBanner
        balance={1450}
        isLoading={false}
      />

      {/* Featured books carousel */}
      <FeaturedCarousel
        books={featuredBooks}
        isLoading={isLoading}
      />

      {/* Trending books horizontal scroll */}
      <section className="pt-4 pb-2">
        <div className="px-5 flex items-center justify-between mb-3">
          <h2 className="text-[18px] font-bold text-text-primary">{trendingLabel}</h2>
          <Link
            to={ROUTES.CATALOG.ROOT}
            className="text-[13px] font-semibold text-accent-500 hover:text-brand-500 transition-colors"
          >
            {seeAllLabel}
          </Link>
        </div>
        <div className="flex gap-3.5 overflow-x-auto px-5 no-scrollbar pb-2">
          {isLoading ? (
            <BookCardSkeleton count={3} />
          ) : (
            trendingBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onToggleSaved={handleToggleSaved}
              />
            ))
          )}
        </div>
      </section>

      {/* In-store pickup trust note */}
      <PickupNote />
    </div>
  );
};

export default HomePage;
