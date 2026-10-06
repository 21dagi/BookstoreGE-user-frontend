import { catalogServiceFactory } from '@/features/catalog/api';
import { walletServiceFactory } from '@/features/wallet/api';
import { equbServiceFactory } from '@/features/equb/api';
import { mockCatalogService } from './services/mockCatalogService';
import { mockWalletService } from './services/mockWalletService';
import { mockEqubService } from './services/mockEqubService';

export function registerMocks(): void {
  catalogServiceFactory.setMock(mockCatalogService);
  walletServiceFactory.setMock(mockWalletService);
  equbServiceFactory.setMock(mockEqubService);
  if (import.meta.env.DEV) {
    console.warn('[Mocks] Mock services registered. Set VITE_USE_MOCKS=false to use real API.');
  }
}
