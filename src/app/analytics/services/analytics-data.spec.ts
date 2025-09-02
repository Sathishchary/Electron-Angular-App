import { TestBed } from '@angular/core/testing';

import { AnalyticsData } from './analytics-data';

describe('AnalyticsData', () => {
  let service: AnalyticsData;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnalyticsData);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
