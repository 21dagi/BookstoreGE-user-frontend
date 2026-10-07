import { PaymentMethod, PaymentVerificationStatus } from '@/shared/types';

// ─── Wallet Domain Types ──────────────────────────────────────────────────────

export interface WalletBalance {
  totalBalance: number;
  currency: 'ETB';
}

export type TransactionCategory = 'purchase' | 'deposit' | 'equb';
export type TransactionSign = 'credit' | 'debit';

export interface WalletTransaction {
  id: string;
  title: { am: string; en: string };
  subtitle: { am: string; en: string };
  amount: number;
  sign: TransactionSign;
  category: TransactionCategory;
  date: { am: string; en: string };
  status: { am: string; en: string };
  description: { am: string; en: string };
  reference: string;
  paymentMethod?: PaymentMethod;
}

export interface PendingDeposit {
  id: string;
  amount: number;
  paymentMethod: PaymentMethod;
  reference: string;
  submittedAt: string; // ISO string
  status: PaymentVerificationStatus;
}

export interface PaymentAccount {
  id: PaymentMethod;
  labelAm: string;
  labelEn: string;
  accountNumber: string;
  shortCode: string;
}

// ─── Wallet Service Contract ──────────────────────────────────────────────────

export interface WalletService {
  getBalance: () => Promise<WalletBalance>;
  getTransactions: (category?: TransactionCategory) => Promise<WalletTransaction[]>;
  getPendingDeposits: () => Promise<PendingDeposit[]>;
  getPaymentAccounts: () => Promise<PaymentAccount[]>;
  deductBalance: (
    amount: number,
    tx: { titleAm: string; titleEn: string; reference?: string }
  ) => Promise<{ success: boolean; newBalance: number; transaction: WalletTransaction }>;
}
