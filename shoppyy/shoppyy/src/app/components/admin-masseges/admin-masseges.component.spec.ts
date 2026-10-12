import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMassegesComponent } from './admin-masseges.component';

describe('AdminMassegesComponent', () => {
  let component: AdminMassegesComponent;
  let fixture: ComponentFixture<AdminMassegesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminMassegesComponent]
    });
    fixture = TestBed.createComponent(AdminMassegesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
