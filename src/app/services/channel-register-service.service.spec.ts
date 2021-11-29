import { TestBed } from '@angular/core/testing';

import { ChannelRegisterServiceService } from './channel-register-service.service';

describe('ChannelRegisterServiceService', () => {
  let service: ChannelRegisterServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChannelRegisterServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
