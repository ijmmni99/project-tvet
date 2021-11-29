import { TestBed } from '@angular/core/testing';

import { ChannelAddServiceService } from './channel-add-service.service';

describe('ChannelAddServiceService', () => {
  let service: ChannelAddServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChannelAddServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
