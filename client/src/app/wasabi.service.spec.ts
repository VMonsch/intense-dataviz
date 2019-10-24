import { TestBed } from '@angular/core/testing';

import { WasabiService } from './wasabi.service';

describe('WasabiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WasabiService = TestBed.get(WasabiService);
    expect(service).toBeTruthy();
  });
});
