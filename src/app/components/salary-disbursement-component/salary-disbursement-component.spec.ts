import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryDisbursementComponent } from './salary-disbursement-component';

describe('SalaryDisbursementComponent', () => {
  let component: SalaryDisbursementComponent;
  let fixture: ComponentFixture<SalaryDisbursementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaryDisbursementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalaryDisbursementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
