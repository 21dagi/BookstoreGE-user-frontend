import { WalletService } from '../types';
import { realWalletService } from './walletService';

let _service: WalletService = realWalletService;

export const walletServiceFactory = {
  get: (): WalletService => _service,
  setMock: (mock: WalletService) => { _service = mock; },
  reset: () => { _service = realWalletService; },
};
