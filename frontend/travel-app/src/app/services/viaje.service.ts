import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Viaje, RespuestaPaginada } from '../models';


@Injectable({
  providedIn: 'root'
})
export class ViajeService {

  private readonly apiUrl = 'http://localhost:8080/api/viajes';

  constructor(private readonly http: HttpClient) {}

  getViajes(page: number = 0, size: number = 10, sort: string = 'fechaInicio'): Observable<RespuestaPaginada<Viaje>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort);
    
    return this.http.get<RespuestaPaginada<Viaje>>(this.apiUrl, { params });
  }

  getViaje(id: number): Observable<Viaje> {
    return this.http.get<Viaje>(`${this.apiUrl}/${id}`);
  }

  getViajesByDestino(destinoId: number, page: number = 0, size: number = 10): Observable<RespuestaPaginada<Viaje>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<RespuestaPaginada<Viaje>>(`${this.apiUrl}/destino/${destinoId}`, { params });
  }

  createViaje(viaje: Viaje): Observable<Viaje> {
    return this.http.post<Viaje>(this.apiUrl, viaje);
  }

  updateViaje(id: number, viaje: Viaje): Observable<Viaje> {
    return this.http.put<Viaje>(`${this.apiUrl}/${id}`, viaje);
  }

  deleteViaje(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
