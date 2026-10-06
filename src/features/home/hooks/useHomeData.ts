import { useState } from 'react';
import {
  useCatalogCategoriesQuery,
  useFeaturedBooksQuery,
  useTrendingBooksQuery,
  useToggleSavedMutation,
} from '@/features/catalog/api';

/**
 * Aggregates all data and state for the Home screen.
 */
export function useHomeData() {
  const [activeCategoryId, setActiveCategoryId] = useState<string>('');

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

  return {
    categories: categories.data ?? [],
    featuredBooks: featured.data ?? [],
    trendingBooks: trending.data ?? [],
    activeCategoryId,
    setActiveCategoryId,
    isLoading,
    hasError,
    refetchAll,
    isSavingToggle: toggleSaved.isPending,
    handleToggleSaved: (bookId: string) => toggleSaved.mutate(bookId),
  };
}
