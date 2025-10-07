import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; 
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DestinoModalComponent, DestinoModalData } from '../destino-modal/destino-modal.component';
import { DestinoService } from '../../services/destino.service';
import { Destino, RespuestaPaginada } from '../../models';
import { ViajeModalComponent, ViajeModalData } from '../viaje-modal/viaje-modal.component';

@Component({
  selector: 'app-lista-destinos',
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSortModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    FormsModule
  ],
  templateUrl: './lista-destinos.component.html',
  styleUrls: ['./lista-destinos.component.scss']
})
export class ListaDestinosComponent implements OnInit {
  // Estado del componente
  destinos: Destino[] = [];
  dataSource = new MatTableDataSource<Destino>([]);
  loading: boolean = false;
  error: string | null = null;

  // Tabla
  displayedColumns: string[] = ['nombre', 'pais', 'estado', 'acciones'];

  // Paginación
  totalElements: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;

  // Filtro
  searchTerm: string = '';
  sortColumn: string = 'nombre';
  sortDirection: string = 'asc';

  constructor(
    private readonly destinoService: DestinoService,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cargarDestinos();
  }

  cargarDestinos(): void {
    this.loading = true;
    this.error = null;
  
    // Parametro de ordenamiento
    const sortParam = `${this.sortColumn},${this.sortDirection}`;

  this.destinoService.getDestinos(
    this.pageIndex, 
    this.pageSize,
    sortParam,
    this.searchTerm || undefined
  )
  // Manejo de la respuesta y errores
  .subscribe({ 
        next: (response: RespuestaPaginada<Destino>) => {
          this.destinos = response.content;
          this.dataSource.data = response.content;
          this.totalElements = response.page.totalElements;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Error al cargar destinos';
          this.loading = false;
          console.error('Error:', error);
        }
      });
  }

  // Al cambiar pagina o tamaño
  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.cargarDestinos();
  }

  // Al cambiar orden
  onSort(sort: Sort): void {
    if (sort.active && sort.direction !== '') {
      this.sortColumn = sort.active;
      this.sortDirection = sort.direction;
      this.pageIndex = 0;
      this.cargarDestinos();
    }
  }

  // Al buscar
  buscarDestinos(): void {
    this.pageIndex = 0;
    this.cargarDestinos();
  }

  limpiarBusqueda(): void {
    this.searchTerm = '';
    this.pageIndex = 0;
    this.cargarDestinos();
  }

  // Al crear nuevo destino
  crearDestino(): void {
    const dialogRef = this.dialog.open(DestinoModalComponent, {
      width: '500px',
      data: { modo: 'crear' } as DestinoModalData
    });

    // Una vez que se cierra el modal, recargar la lista si se creó un destino
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarDestinos();
      }
    });
  }

  reservarViaje(destino: Destino): void {
    const dialogData: ViajeModalData = {
      modo: 'crear',
      viaje: {
        destinoId: destino.id!,
        destinoNombre: destino.nombre,
        fechaInicio: '',
        fechaFin: '',
        precio: this.getPrecioSugerido(destino)
      }
    };

    const dialogRef = this.dialog.open(ViajeModalComponent, {
      width: '600px',
      maxWidth: '90vw',
      data: dialogData,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.success) {
        this.mostrarMensajeExito(`¡Viaje a ${destino.nombre}, ${destino.pais} reservado exitosamente!`);
      }
    });
  }

  // Métodos para gestionar a través del modal
  gestionarDestino(destino: Destino): void {
    const dialogRef = this.dialog.open(DestinoModalComponent, {
      width: '500px',
      maxWidth: '90vw',
      data: { destino: destino, modo: 'gestion' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.action) {
        this.procesarAccionGestion(result, destino);
      }
    });
  }

  private procesarAccionGestion(result: any, destino: Destino): void {
    switch (result.action) {
      case 'ver':
        this.abrirModalVer(destino);
        break;
      case 'editar':
        this.abrirModalEditar(destino);
        break;
      case 'eliminar':
        if (result.success) {
          this.cargarDestinos();
          this.mostrarMensajeExito(`Destino ${destino.nombre} eliminado`);
        }
        break;
    }
  }

  private abrirModalVer(destino: Destino): void {
    this.dialog.open(DestinoModalComponent, {
      width: '500px',
      data: { destino, modo: 'ver' }
    });
  }

  private abrirModalEditar(destino: Destino): void {
    const dialogRef = this.dialog.open(DestinoModalComponent, {
      width: '500px',
      data: { destino, modo: 'editar' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarDestinos();
        this.mostrarMensajeExito(`Destino ${destino.nombre} actualizado`);
      }
    });
  }

  // Mostrar mensaje (alerta)
  private mostrarMensajeExito(mensaje: string): void {
    alert(mensaje);
  }

  // Método preliminar para sugerir precio
  private getPrecioSugerido(destino: Destino): number {
    // Por ahora, precios simples por categoría
    const preciosBasicos = [800, 900, 1000, 1100, 1200, 1300, 1400, 1500];
    
    // Usar el ID del destino para generar un precio "consistente"
    const index = (destino.id || 1) % preciosBasicos.length;
    return preciosBasicos[index];
  }
}
