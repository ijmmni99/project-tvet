import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelRegisterComponent } from './channel-register.component';

describe('ChannelRegisterComponent', () => {
  let component: ChannelRegisterComponent;
  let fixture: ComponentFixture<ChannelRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChannelRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
