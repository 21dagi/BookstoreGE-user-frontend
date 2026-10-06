import { EqubService } from '../types';
import { realEqubService } from './equbService';

let _service: EqubService = realEqubService;

export const equbServiceFactory = {
  get: (): EqubService => _service,
  setMock: (mock: EqubService): void => {
    _service = mock;
  },
};
