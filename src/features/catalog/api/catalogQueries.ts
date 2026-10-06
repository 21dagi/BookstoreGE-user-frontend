import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/constants';
import { catalogServiceFactory } from './catalogServiceFactory';
import { CatalogFilters } from '../types';

export function useCatalogCategoriesQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.catalog.categories(),
    queryFn: () => catalogServiceFactory.get().getCategories(),
    staleTime: 10 * 60_000,
  });
}

export function useFeaturedBooksQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.catalog.featured(),
    queryFn: () => catalogServiceFactory.get().getFeaturedBooks(),
    staleTime: 5 * 60_000,
  });
}

export function useTrendingBooksQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.catalog.books({ trending: true }),
    queryFn: () => catalogServiceFactory.get().getTrendingBooks(),
    staleTime: 5 * 60_000,
  });
}

export function useBooksQuery(filters?: CatalogFilters) {
  return useQuery({
    queryKey: QUERY_KEYS.catalog.books(filters as Record<string, unknown>),
    queryFn: () => catalogServiceFactory.get().getBooks(filters),
  });
}

export function useBookQuery(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.catalog.book(id),
    queryFn: () => catalogServiceFactory.get().getBookById(id),
    enabled: !!id,
  });
}

export function useToggleSavedMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (bookId: string) => catalogServiceFactory.get().toggleSaved(bookId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.catalog.all });
    },
  });
}
