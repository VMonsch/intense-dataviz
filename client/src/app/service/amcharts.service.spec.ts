import { TestBed } from '@angular/core/testing';

import { AmchartsService } from './amcharts.service';

describe('AmchartsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AmchartsService = TestBed.get(AmchartsService);
    expect(service).toBeTruthy();
  });
});
