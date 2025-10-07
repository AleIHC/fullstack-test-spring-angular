import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViajeModalComponent } from './viaje-modal.component';

describe('ViajeModalComponent', () => {
  let component: ViajeModalComponent;
  let fixture: ComponentFixture<ViajeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViajeModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViajeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
