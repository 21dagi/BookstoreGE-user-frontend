import { CatalogService } from '../types';
import { realCatalogService } from './catalogService';

/**
 * Service factory — returns the mock or real implementation based on env flag.
 * Mock implementation is injected by src/mocks/index.ts at startup.
 */
let _service: CatalogService = realCatalogService;

export const catalogServiceFactory = {
  get: (): CatalogService => _service,
  setMock: (mock: CatalogService) => {
    _service = mock;
  },
  reset: () => {
    _service = realCatalogService;
  },
};
