import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { MatDialog } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { ListaDestinosComponent } from './lista-destinos.component';
import { DestinoService } from '../../services/destino.service';
import { RespuestaPaginada, Destino } from '../../models';
import { DestinoModalComponent } from '../destino-modal/destino-modal.component';
import { ViajeModalComponent } from '../viaje-modal/viaje-modal.component';



describe('ListaDestinosComponent', () => {
  let component: ListaDestinosComponent;
  let fixture: ComponentFixture<ListaDestinosComponent>;
  let destinoService: jasmine.SpyObj<DestinoService>;
  let httpMock: HttpTestingController;

  const mockDestinos: RespuestaPaginada<Destino> = {
    content: [
      { id: 1, nombre: 'Bagan', pais: 'Myanmar' },
      { id: 2, nombre: 'Socotra', pais: 'Yemen' }
    ],
    page: {
      size: 10,
      number: 0,
      totalElements: 2,
      totalPages: 1
    }
  };

  // Configuración antes de cada test
  beforeEach(async () => {
    const destinoServiceSpy = jasmine.createSpyObj('DestinoService', ['getDestinos']);
    
    await TestBed.configureTestingModule({
      imports: [ListaDestinosComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: DestinoService, useValue: destinoServiceSpy },
        { provide: MatDialog, useValue: { open: jasmine.createSpy('open') } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaDestinosComponent);
    component = fixture.componentInstance;
    destinoService = TestBed.inject(DestinoService) as jasmine.SpyObj<DestinoService>;
    
    destinoService.getDestinos.and.returnValue(of(mockDestinos));
  });

  // Verificar que el componente se crea correctamente
  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  // Verificar que se cargan los destinos al inicializar
  it('debe cargar destinos al inicializar', () => {
    component.ngOnInit();
    
    expect(destinoService.getDestinos).toHaveBeenCalledWith(0, 10, 'nombre,asc', undefined);
    expect(component.destinos.length).toBe(2);
    expect(component.totalElements).toBe(2);
  });

  // Verificar que se maneja el error al cargar destinos
  it('debe manejar cambio de página', () => {
    const pageEvent = { pageIndex: 1, pageSize: 5, length: 10 };
    
    component.onPageChange(pageEvent);
    
    expect(component.pageIndex).toBe(1);
    expect(component.pageSize).toBe(5);
    expect(destinoService.getDestinos).toHaveBeenCalled();
  });

  // Verificar que se buscan destinos
  it('debe buscar destinos', () => {
    component.searchTerm = 'Bagan';
    
    component.buscarDestinos();
    
    expect(destinoService.getDestinos).toHaveBeenCalledWith(0, 10, 'nombre,asc', 'Bagan');
  });

  // Verificar que se cambia el orden de los destinos
  it('debe cambiar el orden de los destinos', () => {
    component.sortColumn = 'nombre';
    component.sortDirection = 'asc';
    
    const sortEvent = { active: 'pais', direction: 'desc' } as any;
    component.onSort(sortEvent);
    
    expect(component.sortColumn).toBe('pais');
    expect(component.sortDirection).toBe('desc');
    expect(component.pageIndex).toBe(0);
    expect(destinoService.getDestinos).toHaveBeenCalled();
  });

  // Verificar que se limpia la búsqueda
  it('debe limpiar búsqueda y recargar destinos', () => {
    component.searchTerm = 'test';
    component.pageIndex = 2;
    
    component.limpiarBusqueda();
    
    expect(component.searchTerm).toBe('');
    expect(component.pageIndex).toBe(0);
    expect(destinoService.getDestinos).toHaveBeenCalled();
  });

  // Verificar que se abre el modal para crear destino
  it('debe abrir modal para crear destino', () => {
    const mockDialogRef = { afterClosed: () => of(true) };
    const dialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    dialogSpy.open.and.returnValue(mockDialogRef as any);
    
    component.crearDestino();
    
    expect(dialogSpy.open).toHaveBeenCalled();
  });

  // Verificar que se maneja el error al cargar destinos
  it('debe manejar errores al cargar destinos', () => {
    destinoService.getDestinos.and.returnValue(throwError(() => new Error('Test error')));
  
    component.cargarDestinos();
    
    expect(component.error).toBe('Error al cargar destinos');
    expect(component.loading).toBeFalsy();
  });
  
  // Verificar que se abre el modal de gestión de destino
  it('debe abrir modal de gestión de destino', () => {
    const mockDialogRef = { afterClosed: () => of(null) };
    const dialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    dialogSpy.open.and.returnValue(mockDialogRef as any);
    
    const destino = { id: 1, nombre: 'Test', pais: 'Test Country' };
    component.gestionarDestino(destino);
    
    expect(dialogSpy.open).toHaveBeenCalledWith(DestinoModalComponent, {
      width: '500px',
      maxWidth: '90vw', 
      data: { destino: destino, modo: 'gestion' }
    });
  });

  // Verificar que se abre el modal para reservar viaje con destino preseleccionado
  it('debe abrir modal para reservar viaje con destino preseleccionado', () => {
    const mockDialogRef = { afterClosed: () => of({ success: true }) };
    const dialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    dialogSpy.open.and.returnValue(mockDialogRef as any);
    
    const destino: Destino = { id: 1, nombre: 'Bagan', pais: 'Myanmar' };
    component.reservarViaje(destino);
    
    expect(dialogSpy.open).toHaveBeenCalledWith(ViajeModalComponent, {
      width: '600px',
      maxWidth: '90vw',
      data: {
        modo: 'crear',
        viaje: {
          destinoId: 1,
          destinoNombre: 'Bagan',
          fechaInicio: '',
          fechaFin: '',
          precio: jasmine.any(Number) 
        }
      },
      disableClose: true
    });
  });


  // Verificar onSort con sort activo y dirección válida
  it('debe manejar onSort con sort activo y direccion válida', () => {
    const sortEvent = { active: 'nombre', direction: 'asc' } as any;
    component.onSort(sortEvent);
    
    expect(component.sortColumn).toBe('nombre');
    expect(component.sortDirection).toBe('asc');
  });

  // cuando onSort no está activo o no tiene dirección
  it('debe manejar onSort con sort inactivo o sin dirección', () => {
    const sortEvent = { active: '', direction: '' } as any;
    component.onSort(sortEvent);
    
    expect(component.sortColumn).toBe('nombre');
    expect(component.sortDirection).toBe('asc');
  });

  // Probar las diferentes acciones del switch en procesarAccionGestion
  it('debe procesar acción "editar" exitosamente', () => {
    const result = { action: 'editar', success: true };
    const destino = { id: 1, nombre: 'Test', pais: 'Test' };
    
    const mockDialogRef = { afterClosed: () => of(true) };
    const dialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    dialogSpy.open.and.returnValue(mockDialogRef as any);
    
    spyOn(component, 'cargarDestinos');
    component.procesarAccionGestion(result, destino);
    
    expect(dialogSpy.open).toHaveBeenCalled();
    expect(component.cargarDestinos).toHaveBeenCalled();
  });

  // Verificar si acción eliminar llama a cargarDestinos
  it('debe procesar acción "eliminar" exitosamente', () => {
    const result = { action: 'eliminar', success: true };
    const destino = { id: 1, nombre: 'Test', pais: 'Test' };
    
    spyOn(component, 'cargarDestinos');
    spyOn(component, 'mostrarMensajeExito');
    
    component.procesarAccionGestion(result, destino);
    
    expect(component.cargarDestinos).toHaveBeenCalled();
    expect(component.mostrarMensajeExito).toHaveBeenCalledWith('Destino Test eliminado');
  });

  // Verificar precio sugerido con y sin ID
  it('debe probar getPrecioSugerido con diferentes valores de ID', () => {

    const destinoSinId = { nombre: 'Test', pais: 'Test' };
    const precio1 = component.getPrecioSugerido(destinoSinId);
    expect(precio1).toBeGreaterThan(0);

    const destinoConId = { id: 5, nombre: 'Test', pais: 'Test' };
    const precio2 = component.getPrecioSugerido(destinoConId);
    expect(precio2).toBeGreaterThan(0);
  });
});


