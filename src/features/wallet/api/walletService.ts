import { WalletService } from '../types';
import { apiClient } from '@/shared/api';

export const realWalletService: WalletService = {
  getBalance: () => apiClient.get('/wallet/balance'),
  getTransactions: (category) =>
    apiClient.get('/wallet/transactions', { params: category ? { category } : undefined }),
  getPendingDeposits: () => apiClient.get('/wallet/deposits/pending'),
  getPaymentAccounts: () => apiClient.get('/wallet/payment-accounts'),
};
