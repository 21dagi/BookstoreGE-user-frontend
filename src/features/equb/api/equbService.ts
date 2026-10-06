import { EqubService } from '../types';
import { apiClient } from '@/shared/api';

export const realEqubService: EqubService = {
  getMyEqub: () => apiClient.get('/equb/my'),
  getOpenEqubs: () => apiClient.get('/equb/open'),
  payContribution: (equbId, round, amount) =>
    apiClient.post(`/equb/${equbId}/pay`, { round, amount }),
  joinEqub: (equbId) => apiClient.post(`/equb/${equbId}/join`),
};
