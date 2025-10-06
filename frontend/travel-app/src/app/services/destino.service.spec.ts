import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { DestinoService } from './destino.service';
import { Destino, RespuestaPaginada } from '../models';

describe('DestinoService', () => {
  let service: DestinoService;
  let httpMock: HttpTestingController;

  // Configuración antes de cada test
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        DestinoService
      ]
    });
    service = TestBed.inject(DestinoService);
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

  // Obtener lista de destinos paginada
  it('debe obtener lista de destinos paginada', () => {
    const mockResponse: RespuestaPaginada<Destino> = {
      content: [
        { id: 1, nombre: 'Moscú', pais: 'Rusia' },
        { id: 2, nombre: 'Roma', pais: 'Italia' }
      ],
      page: {
        size: 10,
        number: 0,
        totalElements: 2,
        totalPages: 1
      }
    };

    service.getDestinos(0, 10, 'nombre').subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(response.content.length).toBe(2);
      expect(response.page.totalElements).toBe(2);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/destinos?page=0&size=10&sort=nombre');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  // Buscar destinos por país
  it('debe buscar destinos por país', () => {
    const mockResponse: RespuestaPaginada<Destino> = {
      content: [
        { id: 1, nombre: 'Moscú', pais: 'Rusia' }
      ],
      page: {
        size: 10,
        number: 0,
        totalElements: 1,
        totalPages: 1
      }
    };

    service.getDestinos(0, 10, 'nombre', 'Rusia').subscribe(response => {
      expect(response.content.length).toBe(1);
      expect(response.content[0].pais).toBe('Rusia');
    });

    const req = httpMock.expectOne('http://localhost:8080/api/destinos?page=0&size=10&sort=nombre&pais=Rusia');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  // Obtener destino por ID
  it('debe obtener un destino por ID', () => {
    const mockDestino: Destino = { id: 1, nombre: 'Casablanca', pais: 'Marruecos' };

    service.getDestino(1).subscribe(destino => {
      expect(destino).toEqual(mockDestino);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/destinos/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockDestino);
  });

  // Crear un nuevo destino
  it('debe crear un nuevo destino', () => {
    const nuevoDestino: Destino = { nombre: 'Reikiavik', pais: 'Islandia' };
    const destinoCreado: Destino = { id: 3, nombre: 'Reikiavik', pais: 'Islandia' };

    service.createDestino(nuevoDestino).subscribe(destino => {
      expect(destino).toEqual(destinoCreado);
      expect(destino.id).toBeDefined();
    });

    const req = httpMock.expectOne('http://localhost:8080/api/destinos');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(nuevoDestino);
    req.flush(destinoCreado);
  });

  // Actualizar un destino existente
  it('debe actualizar un destino existente', () => {
    const destinoActualizado: Destino = { id: 1, nombre: 'Casablanca Actualizado', pais: 'Marruecos' };

    service.updateDestino(1, destinoActualizado).subscribe(destino => {
      expect(destino).toEqual(destinoActualizado);
      expect(destino.nombre).toBe('Casablanca Actualizado');
    });

    const req = httpMock.expectOne('http://localhost:8080/api/destinos/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(destinoActualizado);
    req.flush(destinoActualizado);
  });
  
  // Eliminar un destino
  it('debe eliminar un destino', () => {
    service.deleteDestino(1).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne('http://localhost:8080/api/destinos/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
