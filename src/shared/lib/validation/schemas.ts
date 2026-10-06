import { z } from 'zod';
import { LIMITS } from '@/shared/constants';

/**
 * Shared Zod Validation Schemas
 */

export const ethiopianPhoneSchema = z
  .string()
  .trim()
  .min(1, { message: 'Phone number is required' })
  .regex(/^(?:\+251|0)?[97]\d{8}$/, {
    message: 'Please enter a valid Ethiopian mobile number (e.g. 0911223344 or 0711223344)',
  });

export const moneyAmountSchema = z
  .number({ invalid_type_error: 'Amount must be a valid number' })
  .positive({ message: 'Amount must be greater than 0' })
  .min(LIMITS.MIN_DEPOSIT_AMOUNT_ETB, {
    message: `Minimum amount is ${LIMITS.MIN_DEPOSIT_AMOUNT_ETB} ETB`,
  })
  .max(LIMITS.MAX_DEPOSIT_AMOUNT_ETB, {
    message: `Maximum amount is ${LIMITS.MAX_DEPOSIT_AMOUNT_ETB} ETB`,
  });

export const transactionReferenceSchema = z
  .string()
  .trim()
  .min(4, { message: 'Transaction reference must be at least 4 characters' })
  .max(50, { message: 'Transaction reference cannot exceed 50 characters' });

export const idSchema = z.string().trim().min(1, { message: 'ID is required' });

export const paginationSchema = z.object({
  page: z.number().int().positive().optional().default(1),
  limit: z.number().int().positive().max(100).optional().default(LIMITS.DEFAULT_PAGE_SIZE),
  search: z.string().optional(),
  sort: z.string().optional(),
});
