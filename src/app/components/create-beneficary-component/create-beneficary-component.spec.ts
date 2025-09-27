import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBeneficaryComponent } from './create-beneficary-component';

describe('CreateBeneficaryComponent', () => {
  let component: CreateBeneficaryComponent;
  let fixture: ComponentFixture<CreateBeneficaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateBeneficaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateBeneficaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
