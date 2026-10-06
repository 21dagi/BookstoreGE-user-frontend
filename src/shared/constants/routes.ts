/**
 * Application Route Paths
 */

export const ROUTES = {
  HOME: '/',
  CATALOG: {
    ROOT: '/books',
    DETAIL: (id: string = ':bookId') => `/books/${id}`,
    SEARCH: '/books/search',
    SAVED: '/books/saved',
  },
  CART: {
    ROOT: '/cart',
    CHECKOUT: '/cart/checkout',
  },
  ORDERS: {
    ROOT: '/orders',
    DETAIL: (id: string = ':orderId') => `/orders/${id}`,
    CONFIRMATION: (id: string = ':orderId') => `/orders/${id}/confirmed`,
  },
  WALLET: {
    ROOT: '/wallet',
    DEPOSIT: '/wallet/deposit',
    TRANSACTIONS: '/wallet/transactions',
    RECEIPT: (id: string = ':txId') => `/wallet/transactions/${id}`,
  },
  EQUB: {
    ROOT: '/equb',
    DETAIL: (id: string = ':groupId') => `/equb/${id}`,
    JOIN: (id: string = ':groupId') => `/equb/${id}/join`,
    CONTRIBUTION: (id: string = ':groupId') => `/equb/${id}/contribute`,
    SCHEDULE: (id: string = ':groupId') => `/equb/${id}/schedule`,
    ROUNDS: (id: string = ':groupId') => `/equb/${id}/rounds`,
  },
  PAYMENT: {
    FLOW: '/payment',
    RESULT: '/payment/result',
  },
  NOTIFICATIONS: '/notifications',
  PROFILE: {
    ROOT: '/profile',
    SETTINGS: '/profile/settings',
    LANGUAGE: '/profile/language',
    THEME: '/profile/theme',
    HELP: '/profile/help',
    POLICIES: '/profile/policies',
  },
} as const;
