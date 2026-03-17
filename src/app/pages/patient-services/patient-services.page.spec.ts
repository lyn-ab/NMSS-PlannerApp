import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PatientServicesPage } from './patient-services.page';

describe('PatientServicesPage', () => {
  let component: PatientServicesPage;
  let fixture: ComponentFixture<PatientServicesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientServicesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
