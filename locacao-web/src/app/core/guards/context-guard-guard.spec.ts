import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { contextGuard } from './context-guard-guard';

describe('contextGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => contextGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
