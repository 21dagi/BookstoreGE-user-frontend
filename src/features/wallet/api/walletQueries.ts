import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/constants';
import { walletServiceFactory } from './walletServiceFactory';
import { TransactionCategory } from '../types';

export function useWalletBalanceQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.wallet.balance(),
    queryFn: () => walletServiceFactory.get().getBalance(),
    staleTime: 2 * 60_000,
  });
}

export function useWalletTransactionsQuery(category?: TransactionCategory) {
  return useQuery({
    queryKey: QUERY_KEYS.wallet.transactions(category ? { category } : undefined),
    queryFn: () => walletServiceFactory.get().getTransactions(category),
    staleTime: 2 * 60_000,
  });
}

export function usePendingDepositsQuery() {
  return useQuery({
    queryKey: [...QUERY_KEYS.wallet.all, 'pending-deposits'] as const,
    queryFn: () => walletServiceFactory.get().getPendingDeposits(),
    staleTime: 60_000,
  });
}

export function usePaymentAccountsQuery() {
  return useQuery({
    queryKey: [...QUERY_KEYS.wallet.all, 'payment-accounts'] as const,
    queryFn: () => walletServiceFactory.get().getPaymentAccounts(),
    staleTime: 30 * 60_000,
  });
}

export function useDeductWalletBalanceMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      amount,
      tx,
    }: {
      amount: number;
      tx: { titleAm: string; titleEn: string; reference?: string };
    }) => walletServiceFactory.get().deductBalance(amount, tx),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.wallet.all });
    },
  });
}
