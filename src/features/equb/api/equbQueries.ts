import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/constants';
import { equbServiceFactory } from './equbServiceFactory';

export function useMyEqubQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.equb.myGroups(),
    queryFn: () => equbServiceFactory.get().getMyEqub(),
    staleTime: 1000 * 60 * 3,
  });
}

export function useOpenEqubsQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.equb.groups(),
    queryFn: () => equbServiceFactory.get().getOpenEqubs(),
    staleTime: 1000 * 60 * 5,
  });
}

export function usePayContributionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ equbId, round, amount }: { equbId: string; round: number; amount: number }) =>
      equbServiceFactory.get().payContribution(equbId, round, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.equb.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.wallet.all });
    },
  });
}

export function useJoinEqubMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (equbId: string) => equbServiceFactory.get().joinEqub(equbId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.equb.all });
    },
  });
}
