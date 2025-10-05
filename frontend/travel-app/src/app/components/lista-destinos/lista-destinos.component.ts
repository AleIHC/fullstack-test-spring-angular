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
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DestinoModalComponent, DestinoModalData } from '../destino-modal/destino-modal.component';

import { DestinoService } from '../../services/destino.service';
import { Destino, RespuestaPaginada } from '../../models';



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
  displayedColumns: string[] = ['id', 'nombre', 'pais', 'acciones'];

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

  // Al eliminar
  eliminarDestino(id: number): void {
    if (confirm('¿Estás seguro de eliminar este destino?')) {
      this.loading = true;
      this.destinoService.deleteDestino(id).subscribe({
        next: () => {
          this.cargarDestinos();
        },
        error: (error) => {
          this.error = 'Error al eliminar destino';
          this.loading = false;
          console.error('Error:', error);
        }
      });
    }
  }

  crearDestino(): void {
    const dialogRef = this.dialog.open(DestinoModalComponent, {
      width: '500px',
      data: { isEdit: false } as DestinoModalData
    });

    // Una vez que se cierra el modal, recargar la lista si se creó un destino
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarDestinos();
      }
    });
  }

  editarDestino(id: number): void {
    // Buscar destino por id
    const destino = this.destinos.find(d => d.id === id);
    if (!destino) return;

    const dialogRef = this.dialog.open(DestinoModalComponent, {
      width: '500px',
      data: { destino, isEdit: true } as DestinoModalData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Una vez que se editó, recargar la lista
      this.cargarDestinos();
      }
    });
  }

  verDestino(id: number): void {
    this.editarDestino(id);
  }
}
