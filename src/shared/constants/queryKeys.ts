/**
 * Centralized TanStack Query Key Factory
 */

export const QUERY_KEYS = {
  auth: {
    all: ['auth'] as const,
    session: () => [...QUERY_KEYS.auth.all, 'session'] as const,
    profile: () => [...QUERY_KEYS.auth.all, 'profile'] as const,
  },
  catalog: {
    all: ['catalog'] as const,
    books: (params?: Record<string, unknown>) =>
      [...QUERY_KEYS.catalog.all, 'books', params] as const,
    book: (id: string) => [...QUERY_KEYS.catalog.all, 'book', id] as const,
    categories: () => [...QUERY_KEYS.catalog.all, 'categories'] as const,
    featured: () => [...QUERY_KEYS.catalog.all, 'featured'] as const,
  },
  orders: {
    all: ['orders'] as const,
    list: (params?: Record<string, unknown>) =>
      [...QUERY_KEYS.orders.all, 'list', params] as const,
    detail: (id: string) => [...QUERY_KEYS.orders.all, 'detail', id] as const,
  },
  wallet: {
    all: ['wallet'] as const,
    balance: () => [...QUERY_KEYS.wallet.all, 'balance'] as const,
    transactions: (params?: Record<string, unknown>) =>
      [...QUERY_KEYS.wallet.all, 'transactions', params] as const,
    transaction: (id: string) =>
      [...QUERY_KEYS.wallet.all, 'transaction', id] as const,
  },
  equb: {
    all: ['equb'] as const,
    groups: (params?: Record<string, unknown>) =>
      [...QUERY_KEYS.equb.all, 'groups', params] as const,
    group: (id: string) => [...QUERY_KEYS.equb.all, 'group', id] as const,
    myGroups: () => [...QUERY_KEYS.equb.all, 'my-groups'] as const,
    schedule: (id: string) =>
      [...QUERY_KEYS.equb.all, 'schedule', id] as const,
    contributions: (groupId?: string) =>
      [...QUERY_KEYS.equb.all, 'contributions', groupId] as const,
  },
  notifications: {
    all: ['notifications'] as const,
    list: () => [...QUERY_KEYS.notifications.all, 'list'] as const,
    unreadCount: () =>
      [...QUERY_KEYS.notifications.all, 'unread-count'] as const,
  },
} as const;
