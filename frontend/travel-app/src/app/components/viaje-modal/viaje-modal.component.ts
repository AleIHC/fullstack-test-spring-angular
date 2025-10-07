import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ViajeService } from '../../services/viaje.service';
import { DestinoService } from '../../services/destino.service';
import { Viaje } from '../../models/viaje.model';
import { Destino } from '../../models/destino.model';

// Interfaz para los datos que se pasan al modal
export interface ViajeModalData {
  viaje?: Viaje;
  modo: 'crear' | 'editar' | 'ver';
}

@Component({
  selector: 'app-viaje-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './viaje-modal.component.html',
  styleUrls: ['./viaje-modal.component.scss']
})
export class ViajeModalComponent implements OnInit {
  viajeForm: FormGroup;
  destinos: Destino[] = [];
  loading = false;
  error = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly dialogRef: MatDialogRef<ViajeModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ViajeModalData,
    private readonly viajeService: ViajeService,
    private readonly destinoService: DestinoService
  ) {
    this.viajeForm = this.createForm();
  }

  // Cargar datos al iniciar el componente
  ngOnInit(): void {
    this.cargarDestinos();
    if (this.data.viaje) {
      this.cargarDatosViaje();
    }
  }

  // Crear el formulario con validaciones
  private createForm(): FormGroup {
    return this.fb.group({
      destinoId: [null, [Validators.required]],
      fechaInicio: [null, [Validators.required]],
      fechaFin: [null, [Validators.required]],
      precio: [null, [Validators.required, Validators.min(0.01)]]
    }, { 
      validators: ViajeModalComponent.validarFechas
    });
  }

  // Validar que la fecha de inicio sea anterior a la fecha de fin
  private static validarFechas(control: AbstractControl): ValidationErrors | null {
    const fechaInicio = control.get('fechaInicio')?.value;
    const fechaFin = control.get('fechaFin')?.value;

    if (fechaInicio && fechaFin && new Date(fechaInicio) >= new Date(fechaFin)) {
      return { fechasInvalidas: true };
    }
    return null;
  }

  // Cargar destinos para el select
  private cargarDestinos(): void {
    this.destinoService.getDestinos(0, 100).subscribe({
      next: (response) => {
        this.destinos = response.content || [];
      },
      error: (error) => {
        console.error('Error al cargar destinos:', error);
        this.error = 'Error al cargar destinos';
      }
    });
  }

  // Cargar datos del viaje en el formulario si se está editando o viendo
  private cargarDatosViaje(): void {
    if (this.data.viaje) {
      this.viajeForm.patchValue({
        destinoId: this.data.viaje.destinoId,
        fechaInicio: new Date(this.data.viaje.fechaInicio),
        fechaFin: new Date(this.data.viaje.fechaFin),
        precio: this.data.viaje.precio
      });
    }
  }

  // Getters para facilitar el acceso a propiedades en la plantilla

  get tituloModal(): string {
    switch (this.data.modo) {
      case 'crear': return 'Crear Nuevo Viaje';
      case 'editar': return 'Editar Viaje';
      case 'ver': return 'Detalles del Viaje';
      default: return 'Viaje';
    }
  }

  get iconoModal(): string {
    switch (this.data.modo) {
      case 'crear': return 'add_circle';
      case 'editar': return 'edit';
      case 'ver': return 'visibility';
      default: return 'flight_takeoff';
    }
  }

  get esFormularioValido(): boolean {
    return this.viajeForm.valid;
  }

  get esFormularioEditable(): boolean {
    return this.data.modo !== 'ver';
  }

  // Calcular duración del viaje en días
  getDuracionViaje(): number {
    const fechaInicio = this.viajeForm.get('fechaInicio')?.value;
    const fechaFin = this.viajeForm.get('fechaFin')?.value;

    if (fechaInicio && fechaFin) {
      const inicio = new Date(fechaInicio);
      const fin = new Date(fechaFin);
      const diferencia = fin.getTime() - inicio.getTime();
      return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
    }
    return 0;
  }

  // Obtener nombre completo del destino seleccionado
  getDestinoNombre(destinoId: number): string {
    const destino = this.destinos.find(d => d.id === destinoId);
    return destino ? `${destino.nombre}, ${destino.pais}` : 'Destino no encontrado';
  }

  // Al guardar el viaje (crear o actualizar)
  onGuardar(): void {
    if (!this.esFormularioValido) {
      this.marcarCamposComoTocados();
      return;
    }

    this.loading = true;
    this.error = '';

    const viajeData: Viaje = {
      ...this.viajeForm.value,
      id: this.data.viaje?.id
    };

    const operacion = this.data.modo === 'crear' 
      ? this.viajeService.createViaje(viajeData)
      : this.viajeService.updateViaje(viajeData.id!, viajeData);

    operacion.subscribe({
      next: (result) => {
        this.dialogRef.close({ success: true, viaje: result });
      },
      error: (error) => {
        console.error('Error al guardar viaje:', error);
        this.error = 'Error al guardar el viaje. Por favor, intenta de nuevo.';
        this.loading = false;
      }
    });
  }

  // Marcar todos los campos como tocados para mostrar errores de validación
  private marcarCamposComoTocados(): void {
    Object.keys(this.viajeForm.controls).forEach(key => {
      this.viajeForm.get(key)?.markAsTouched();
    });
  }

  // Al cancelar o cerrar el modal
  onCancelar(): void {
    this.dialogRef.close({ success: false });
  }

  // Obtener mensaje de error para un campo específico
  getErrorMessage(campo: string): string {
    const control = this.viajeForm.get(campo);
    if (control?.hasError('required')) {
      return `Este campo es requerido`;
    }
    if (control?.hasError('min')) {
      return `El precio debe ser mayor a 0`;
    }
    if (this.viajeForm.hasError('fechasInvalidas')) {
      return 'La fecha de inicio debe ser anterior a la fecha de fin';
    }
    return '';
  }
}