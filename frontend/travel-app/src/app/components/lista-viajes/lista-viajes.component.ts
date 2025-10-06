import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { ViajeService } from '../../services/viaje.service';
import { DestinoService } from '../../services/destino.service';
import { Viaje } from '../../models/viaje.model';
import { Destino } from '../../models/destino.model';

// Interfaz extendida para el componente
interface ViajeEnriquecido extends Viaje {
  destino?: Destino;
}

@Component({
  selector: 'app-lista-viajes',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSliderModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    FormsModule
  ],
  templateUrl: './lista-viajes.component.html',
  styleUrls: ['./lista-viajes.component.scss']
})
export class ListaViajesComponent implements OnInit {
  viajes: ViajeEnriquecido[] = [];
  destinos: Destino[] = [];
  viajesFiltrados: ViajeEnriquecido[] = [];
  loading = false;
  error = '';

  // Filtros
  filtroDestino = '';
  filtroPrecioMax = 2000;
  searchTerm = '';

  constructor(
    private readonly viajeService: ViajeService,
    private readonly destinoService: DestinoService
  ) {}

  // Cargar datos al iniciar el componente
  ngOnInit(): void {
    this.cargarDestinos().then(() => {
      this.cargarViajes();
    });
  }

  // Cargar viajes desde el servicio
  cargarViajes(): void {
    this.loading = true;
    this.error = '';

    this.viajeService.getViajes(0, 50).subscribe({
      next: (response) => {
        const viajes = response.content || [];
        
        // Agregar a viajes, información de destinos
        this.viajes = viajes.map(viaje => ({
          ...viaje,
          destino: this.destinos.find(d => d.id === viaje.destinoId)
        }));
        
        this.aplicarFiltros();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar viajes:', error);
        this.error = 'Error al cargar viajes';
        this.loading = false;
      }
    });
  }

  // Cargar destinos desde el servicio
  cargarDestinos(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.destinoService.getDestinos(0, 100).subscribe({
        next: (response) => {
          this.destinos = response.content || [];
          resolve();
        },
        error: (error) => {
          console.error('Error al cargar destinos:', error);
          reject(new Error(error));
        }
      });
    });
  }

  // Aplicar filtros a la lista de viajes
  aplicarFiltros(): void {
    this.viajesFiltrados = this.viajes.filter(viaje => {
      const destino = viaje.destino;
      
      // Filtro por destino
      const destinoMatch = !this.filtroDestino || 
        (destino?.nombre?.toLowerCase().includes(this.filtroDestino.toLowerCase()));
      
      // Filtro por precio máximo
      const precioMatch = viaje.precio <= this.filtroPrecioMax;
      
      // Filtro por término de búsqueda (nombre o país)
      const busquedaMatch = !this.searchTerm ||
        (destino && (
          destino.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          destino.pais.toLowerCase().includes(this.searchTerm.toLowerCase())
        )) ||
        viaje.destinoNombre?.toLowerCase().includes(this.searchTerm.toLowerCase());

      return destinoMatch && precioMatch && busquedaMatch;
    });
  }

  // Al cambiar cualquier filtro
  onFiltroChange(): void {
    this.aplicarFiltros();
  }

  // Calcular duración del viaje en días
  getDuracionViaje(viaje: Viaje): number {
    const inicio = new Date(viaje.fechaInicio);
    const fin = new Date(viaje.fechaFin);
    const diferencia = fin.getTime() - inicio.getTime();
    return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
  }

  // Determinar si el viaje es una "oferta"
  esOferta(viaje: Viaje): boolean {
    return viaje.precio < 1000;
  }

  // Obtener nombre del destino
  getDestinoNombre(viaje: ViajeEnriquecido): string {
    return viaje.destino?.nombre || viaje.destinoNombre || 'Destino no disponible';
  }

  // Obtener país del destino
  getDestinoPais(viaje: ViajeEnriquecido): string {
    return viaje.destino?.pais || 'País no disponible';
  }

  verDetalleViaje(viaje: ViajeEnriquecido): void {
    // TODO: Implementar modal o navegación a detalle
    console.log('Ver detalle de viaje:', viaje);
    alert(`Detalle del viaje a ${this.getDestinoNombre(viaje)}\nPrecio: $${viaje.precio}\nDuración: ${this.getDuracionViaje(viaje)} días`);
  }

  editarViaje(viaje: ViajeEnriquecido): void {
    // TODO: Implementar modal de edición
    console.log('Editar viaje:', viaje);
    alert('Funcionalidad de edición próximamente');
  }

  // Eliminar viaje con confirmación
  eliminarViaje(viaje: ViajeEnriquecido): void {
    const destinoNombre = this.getDestinoNombre(viaje);
    if (confirm(`¿Estás seguro de que quieres eliminar el viaje a ${destinoNombre}?`)) {
      if (viaje.id) {
        this.viajeService.deleteViaje(viaje.id).subscribe({
          next: () => {
            this.cargarViajes();
            alert('Viaje eliminado exitosamente');
          },
          error: (error) => {
            console.error('Error al eliminar viaje:', error);
            this.error = 'Error al eliminar viaje';
          }
        });
      }
    }
  }

  // Limpiar todos los filtros
  limpiarFiltros(): void {
    this.filtroDestino = '';
    this.filtroPrecioMax = 2000;
    this.searchTerm = '';
    this.aplicarFiltros();
  }

  crearNuevoViaje(): void {
    // TODO: Implementar modal de creación
    alert('Funcionalidad de creación próximamente');
  }

  // Recargar la lista de viajes
  recargarViajes(): void {
    this.cargarViajes();
  }
}