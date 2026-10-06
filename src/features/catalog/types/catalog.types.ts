import { BookAvailability, LocalizedString } from '@/shared/types';

// ─── Book Domain Types ────────────────────────────────────────────────────────

export interface BookCategory {
  id: string;
  name: LocalizedString;
  emoji: string;
}

export interface Book {
  id: string;
  title: LocalizedString;
  author: LocalizedString;
  publisher?: LocalizedString;
  coverUrl?: string;
  price: number;
  originalPrice?: number;
  availability: BookAvailability;
  categoryId: string;
  isbn?: string;
  pageCount?: number;
  description?: LocalizedString;
  isFeatured?: boolean;
  isTrending?: boolean;
  isSaved?: boolean;
  discountPercent?: number;
  discountLabel?: LocalizedString;
  /** 'sacred_item' means ንዋያተ ቅድሳት; 'book' means standard book */
  itemType?: 'book' | 'sacred_item';
  badge?: 'new' | 'discount' | 'handmade' | 'featured' | string;
  badgeLabel?: LocalizedString;
}

export interface FeaturedBook extends Book {
  featuredLabel?: LocalizedString;
}

export interface CatalogFilters {
  categoryId?: string;
  segment?: 'books' | 'sacred_items';
  search?: string;
  page?: number;
  limit?: number;
}

// ─── Catalog Service Contract ─────────────────────────────────────────────────

export interface CatalogService {
  getCategories: () => Promise<BookCategory[]>;
  getFeaturedBooks: () => Promise<FeaturedBook[]>;
  getTrendingBooks: () => Promise<Book[]>;
  getBooks: (filters?: CatalogFilters) => Promise<Book[]>;
  getBookById: (id: string) => Promise<Book>;
  toggleSaved: (bookId: string) => Promise<{ isSaved: boolean }>;
}
