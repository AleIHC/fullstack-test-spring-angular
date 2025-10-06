import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ViajeService } from './viaje.service';
import { Viaje, RespuestaPaginada } from '../models';

describe('ViajeService', () => {
  let service: ViajeService;
  let httpMock: HttpTestingController;

  // Configuración antes de cada test
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ViajeService
      ]
    });
    service = TestBed.inject(ViajeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  // Configuración después de cada test
  afterEach(() => {
    httpMock.verify();
  });

  // Verificar que el servicio se crea correctamente
  it('debe ser creado correctamente', () => {
    expect(service).toBeTruthy();
  });

  // Obtener lista de viajes paginada
  it('debe obtener lista de viajes paginada', () => {
    const mockResponse: RespuestaPaginada<Viaje> = {
      content: [
        { 
          id: 1, 
          fechaInicio: '2024-12-01', 
          fechaFin: '2024-12-07', 
          precio: 2800.00, 
          destinoId: 1, 
          destinoNombre: 'Bután' 
        },
        { 
          id: 2, 
          fechaInicio: '2024-12-15', 
          fechaFin: '2024-12-22', 
          precio: 3500.00, 
          destinoId: 2, 
          destinoNombre: 'Socotra' 
        }
      ],
      page: {
        size: 10,
        number: 0,
        totalElements: 2,
        totalPages: 1
      }
    };

    service.getViajes(0, 10).subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(response.content.length).toBe(2);
      expect(response.content[0].destinoNombre).toBe('Bután');
    });

      const req = httpMock.expectOne('http://localhost:8080/api/viajes?page=0&size=10&sort=fechaInicio');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

  // Obtener un viaje por ID
  it('debe obtener un viaje por ID', () => {
    const mockViaje: Viaje = { 
      id: 1, 
      fechaInicio: '2024-12-01', 
      fechaFin: '2024-12-07', 
      precio: 1850.00, 
      destinoId: 1, 
      destinoNombre: 'Bogotá' 
    };

    service.getViaje(1).subscribe(viaje => {
      expect(viaje).toEqual(mockViaje);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/viajes/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockViaje);
  });

  // Obtener viajes por destino
  it('debe obtener viajes por destino', () => {
    const mockResponse: RespuestaPaginada<Viaje> = {
      content: [
        { 
          id: 1, 
          fechaInicio: '2027-12-01', 
          fechaFin: '2027-12-05', 
          precio: 200.00, 
          destinoId: 5, 
          destinoNombre: 'Salar de Uyuni' 
        }
      ],
      page: {
        size: 10,
        number: 0,
        totalElements: 1,
        totalPages: 1
      }
    };

    service.getViajesByDestino(5, 0, 10).subscribe(response => {
      expect(response.content.length).toBe(1);
      expect(response.content[0].destinoId).toBe(5);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/viajes/destino/5?page=0&size=10');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  // Crear un nuevo viaje
  it('debe crear un nuevo viaje', () => {
    const nuevoViaje: Viaje = { 
      fechaInicio: '2025-03-15', 
      fechaFin: '2025-03-22', 
      precio: 3200.00, 
      destinoId: 3 
    };
    const viajeCreado: Viaje = { 
      id: 3, 
      fechaInicio: '2025-03-15', 
      fechaFin: '2025-03-22', 
      precio: 3200.00, 
      destinoId: 3, 
      destinoNombre: 'Copenhague' 
    };

    service.createViaje(nuevoViaje).subscribe(viaje => {
      expect(viaje).toEqual(viajeCreado);
      expect(viaje.id).toBeDefined();
    });

    const req = httpMock.expectOne('http://localhost:8080/api/viajes');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(nuevoViaje);
    req.flush(viajeCreado);
  });

  // Actualizar un viaje existente
  it('debe actualizar un viaje existente', () => {
    const viajeActualizado: Viaje = { 
      id: 1, 
      fechaInicio: '2024-12-10', 
      fechaFin: '2024-12-17', 
      precio: 2750.00, 
      destinoId: 2, 
      destinoNombre: 'Kamchatka' 
    };

    service.updateViaje(1, viajeActualizado).subscribe(viaje => {
      expect(viaje).toEqual(viajeActualizado);
      expect(viaje.precio).toBe(2750.00);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/viajes/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(viajeActualizado);
    req.flush(viajeActualizado);
  });

  // Eliminar un viaje
  it('debe eliminar un viaje', () => {
    service.deleteViaje(1).subscribe(response => {
      expect(response).toBeNull(); 
    });

    const req = httpMock.expectOne('http://localhost:8080/api/viajes/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});


