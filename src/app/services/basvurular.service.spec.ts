import { TestBed } from '@angular/core/testing';

import { BasvurularService } from './basvurular.service';

describe('BasvurularService', () => {
  let service: BasvurularService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BasvurularService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
