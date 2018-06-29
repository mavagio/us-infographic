import { TestBed, inject } from '@angular/core/testing';

import { UsInfographicsService } from './us-infographics.service';

describe('UsInfographicsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UsInfographicsService]
    });
  });

  it('should be created', inject([UsInfographicsService], (service: UsInfographicsService) => {
    expect(service).toBeTruthy();
  }));
});
