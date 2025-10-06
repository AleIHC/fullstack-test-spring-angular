import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { MatDialog } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { ListaDestinosComponent } from './lista-destinos.component';
import { DestinoService } from '../../services/destino.service';
import { RespuestaPaginada, Destino } from '../../models';



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

  // Verificar que se abre el modal para ver destino
  it('debe abrir modal para ver destino', () => {
    const mockDialogRef = { afterClosed: () => of(false) };
    const dialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    dialogSpy.open.and.returnValue(mockDialogRef as any);
    
    component.destinos = [{ id: 1, nombre: 'Test', pais: 'Test Country' }];
    component.verDestino(1);
    
    expect(dialogSpy.open).toHaveBeenCalled();
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
});


