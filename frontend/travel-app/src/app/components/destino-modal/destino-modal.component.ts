import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

import { DestinoService } from '../../services/destino.service';
import { Destino } from '../../models';

export interface DestinoModalData {
  destino?: Destino;
  modo: 'crear' | 'editar' | 'ver' | 'gestion'; 
}

@Component({
  selector: 'app-destino-modal',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule
  ],
  templateUrl: './destino-modal.component.html',
  styleUrl: './destino-modal.component.scss'
})
export class DestinoModalComponent implements OnInit {
  destinoForm: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly destinoService: DestinoService,
    public dialogRef: MatDialogRef<DestinoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DestinoModalData
  ) {
    this.destinoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      pais: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  // Al inicializar, si es edición, cargar los datos del destino en el formulario
  ngOnInit(): void {
    if ((this.data.modo === 'editar' || this.data.modo === 'ver') && this.data.destino) {
      this.destinoForm.patchValue({
        nombre: this.data.destino.nombre,
        pais: this.data.destino.pais
      });
    }
  }

  get titulo(): string {
    switch (this.data.modo) {
      case 'crear': return 'Crear Nuevo Destino';
      case 'editar': return 'Editar Destino';
      case 'ver': return 'Detalles del Destino';
      case 'gestion': return `Gestionar ${this.data.destino?.nombre}`;
      default: return 'Destino';
    }
  }


  get submitButtonText(): string {
    switch (this.data.modo) {
      case 'crear': return 'Crear';
      case 'editar': return 'Actualizar';
      case 'gestion': return 'Cerrar';
      default: return 'Guardar';
    }
  }

  // Al enviar el formulario, crear o actualizar el destino
  onSubmit(): void {
    if (this.data.modo === 'gestion') {
      this.dialogRef.close();
      return;
    }

    if (this.destinoForm.valid) {
      this.loading = true;
      this.error = null;

      const destinoData: Destino = {
        nombre: this.destinoForm.value.nombre,
        pais: this.destinoForm.value.pais
      };


        const operation = this.data.modo === 'editar' && this.data.destino?.id
        ? this.destinoService.updateDestino(this.data.destino.id, destinoData)
        : this.destinoService.createDestino(destinoData);
      
      operation.subscribe({
        next: (result) => {
          this.loading = false;
          this.dialogRef.close(result);
        },
        error: (error) => {
          this.loading = false;
          this.error = 'Error al guardar el destino';
          console.error('Error:', error);
        }
      });
    }
  }

  // Al cancelar
  onCancel(): void {
    this.dialogRef.close();
  }

  // Obtener controles para validaciones
  get nombreControl() {
    return this.destinoForm.get('nombre');
  }

  get paisControl() {
    return this.destinoForm.get('pais');
  }

  // Métodos para obtener iconos según modo
  getIconoModal(): string {
    switch (this.data.modo) {
      case 'crear': return 'add';
      case 'editar': return 'edit';
      case 'ver': return 'visibility';
      case 'gestion': return 'settings';
      default: return 'place';
    }
  }

  getIconoSubmit(): string {
    switch (this.data.modo) {
      case 'crear': return 'add';
      case 'editar': return 'save';
      default: return 'save';
    }
  }


  // Métodos para gestión
  verDetalles(): void {
    this.dialogRef.close({ action: 'ver', destino: this.data.destino });
  }

  editarDestino(): void {
    this.dialogRef.close({ action: 'editar', destino: this.data.destino });
  }

  eliminarDestino(): void {
    const nombre = this.data.destino?.nombre;
    if (confirm(`¿Estás seguro de eliminar ${nombre}?`)) {
      if (this.data.destino?.id) {
        this.loading = true;
        this.destinoService.deleteDestino(this.data.destino.id).subscribe({
          next: () => {
            this.dialogRef.close({ 
              action: 'eliminar', 
              success: true,
              message: `${nombre} eliminado exitosamente`
            });
          },
          error: (error) => {
            console.error('Error al eliminar:', error);
            this.error = 'Error al eliminar el destino';
            this.loading = false;
          }
        });
      }
    }
  }
}
