/**
 * Core Domain Enums & Union Types
 * Derived from the authoritative business rules for Gedame Eyesus Bookstore & Equb.
 */

export type PaymentMethod = 'telebirr' | 'cbe' | 'boa';

export type PaymentVerificationStatus =
  | 'started'
  | 'submitted'
  | 'awaiting_verification'
  | 'further_review'
  | 'confirmed'
  | 'rejected'
  | 'expired'
  | 'cancelled';

export type OrderStatus =
  | 'pending_payment'
  | 'awaiting_verification'
  | 'confirmed'
  | 'preparing'
  | 'ready_for_pickup'
  | 'collected'
  | 'cancelled'
  | 'refunded';

export type ContributionStatus =
  | 'upcoming'
  | 'due'
  | 'submitted'
  | 'confirmed'
  | 'overdue'
  | 'prepaid'
  | 'covered_by_plan'
  | 'adjusted';

export type EqubGroupStatus =
  | 'enrollment_open'
  | 'enrollment_closed'
  | 'active'
  | 'paused'
  | 'completed'
  | 'discontinued'
  | 'cancelled';

export type EqubRoundStatus =
  | 'upcoming'
  | 'recipient_pending'
  | 'credit_issued'
  | 'completed';

export type WalletBucket = 'general' | 'equb_credit';

export type BookAvailability =
  | 'in_stock'
  | 'few_left'
  | 'out_of_stock'
  | 'unavailable';

export type LanguageCode = 'am' | 'en';

export type ThemeMode = 'light' | 'dark' | 'auto';

export interface LocalizedString {
  am: string;
  en: string;
}

export interface Money {
  amount: number; // in ETB (decimal or cents representation)
  currency: 'ETB';
}
