import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantRentals } from './rentals';

describe('TenantRentals', () => {
  let component: TenantRentals;
  let fixture: ComponentFixture<TenantRentals>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenantRentals],
    }).compileComponents();

    fixture = TestBed.createComponent(TenantRentals);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
