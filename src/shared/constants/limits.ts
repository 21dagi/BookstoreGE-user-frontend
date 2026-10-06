/**
 * Application limits and defaults
 */

export const LIMITS = {
  MIN_DEPOSIT_AMOUNT_ETB: 10,
  MAX_DEPOSIT_AMOUNT_ETB: 100_000,
  MAX_PROOF_IMAGE_SIZE_BYTES: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  DEFAULT_PAGE_SIZE: 20,
  REQUEST_TIMEOUT_MS: 15_000,
  IDEMPOTENCY_HEADER: 'X-Idempotency-Key',
} as const;
