import { CatalogService } from '@/features/catalog/types';
import { MOCK_CATEGORIES, MOCK_FEATURED_BOOKS, MOCK_TRENDING_BOOKS } from '../data';
import { delay } from '../utils';

const savedSet = new Set<string>();

export const mockCatalogService: CatalogService = {
  async getCategories() {
    await delay(300);
    return MOCK_CATEGORIES;
  },

  async getFeaturedBooks() {
    await delay(600);
    return MOCK_FEATURED_BOOKS.map((b) => ({ ...b, isSaved: savedSet.has(b.id) }));
  },

  async getTrendingBooks() {
    await delay(500);
    return MOCK_TRENDING_BOOKS.map((b) => ({ ...b, isSaved: savedSet.has(b.id) }));
  },

  async getBooks(filters) {
    await delay(500);
    const all = [...MOCK_FEATURED_BOOKS, ...MOCK_TRENDING_BOOKS];
    if (filters?.categoryId) {
      return all.filter((b) => b.categoryId === filters.categoryId);
    }
    return all;
  },

  async getBookById(id) {
    await delay(400);
    const all = [...MOCK_FEATURED_BOOKS, ...MOCK_TRENDING_BOOKS];
    const book = all.find((b) => b.id === id);
    if (!book) throw new Error(`Book not found: ${id}`);
    return { ...book, isSaved: savedSet.has(id) };
  },

  async toggleSaved(bookId) {
    await delay(200);
    if (savedSet.has(bookId)) {
      savedSet.delete(bookId);
      return { isSaved: false };
    } else {
      savedSet.add(bookId);
      return { isSaved: true };
    }
  },
};
