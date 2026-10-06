import { CatalogService } from '../types';
import { apiClient } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

export { QUERY_KEYS };

/**
 * Real API catalog service implementation.
 * Used when VITE_USE_MOCKS=false.
 */
export const realCatalogService: CatalogService = {
  getCategories: () => apiClient.get('/catalog/categories'),
  getFeaturedBooks: () => apiClient.get('/catalog/featured'),
  getTrendingBooks: () => apiClient.get('/catalog/trending'),
  getBooks: (filters) => apiClient.get('/catalog/books', { params: filters as Record<string, string | number | boolean | undefined> }),
  getBookById: (id) => apiClient.get(`/catalog/books/${id}`),
  toggleSaved: (bookId) => apiClient.post(`/catalog/books/${bookId}/save`),
};
