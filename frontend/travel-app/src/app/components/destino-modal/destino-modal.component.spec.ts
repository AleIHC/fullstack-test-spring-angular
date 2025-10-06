import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DestinoModalComponent } from './destino-modal.component';

describe('DestinoModalComponent', () => {
  let component: DestinoModalComponent;
  let fixture: ComponentFixture<DestinoModalComponent>;

  // Configuración antes de cada test
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DestinoModalComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: { isEdit: false } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DestinoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Verificar que el componente se crea correctamente
  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });
});
