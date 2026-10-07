import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/shared/i18n';
import { ErrorState } from '@/shared/ui/ErrorState';
import { ROUTES } from '@/shared/constants';
import { useHomeData } from '../hooks/useHomeData';
import { HomeHeader } from '../components/HomeHeader';
import { WalletBanner } from '../components/WalletBanner';
import { FeaturedCarousel } from '../components/FeaturedCarousel';
import { BookCard, BookCardSkeleton } from '../components/BookCard';

const HomePage: React.FC = () => {
  const { language } = useLanguage();
  const {
    featuredBooks,
    trendingBooks,
    isLoading,
    hasError,
    refetchAll,
    handleToggleSaved,
  } = useHomeData();

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
    <div className="w-full pb-24 bg-bg-primary min-h-screen">
      {/* Header */}
      <HomeHeader unreadCount={2} />

      {/* Headline */}
      <section className="px-4 pt-2 pb-1.5">
        <h1 className="text-[22px] font-extrabold text-text-primary leading-[1.25] tracking-tight max-w-[260px]">
          {headlineLabel}
        </h1>
      </section>

      {/* Wallet balance */}
      <WalletBanner balance={1450} isLoading={false} />

      {/* Featured books carousel */}
      <FeaturedCarousel books={featuredBooks} isLoading={isLoading} />

      {/* Trending books */}
      <section className="pt-2 pb-2">
        <div className="px-4 flex items-center justify-between mb-2">
          <h2 className="text-[16px] font-bold text-text-primary">{trendingLabel}</h2>
          <Link
            to={ROUTES.CATALOG.ROOT}
            className="text-[12px] font-semibold text-accent-500 hover:text-brand-500 transition-colors"
          >
            {seeAllLabel}
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto px-4 no-scrollbar pb-1">
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
    </div>
  );
};

export default HomePage;
