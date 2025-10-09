import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ViajeModalComponent } from './viaje-modal.component';

describe('ViajeModalComponent', () => {
  let component: ViajeModalComponent;
  let fixture: ComponentFixture<ViajeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViajeModalComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MatDialogRef, useValue: { close: jasmine.createSpy('close') } },
        { provide: MAT_DIALOG_DATA, useValue: { modo: 'crear' } }  // ⬅️ Agregar estos providers
      ]
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
