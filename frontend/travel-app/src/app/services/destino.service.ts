import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Destino, RespuestaPaginada } from '../models';

@Injectable({
  providedIn: 'root'
})

export class DestinoService {
  private readonly apiUrl = 'http://localhost:8080/api/destinos';

  constructor(private readonly http: HttpClient) {}

  getDestinos(
    page: number = 0,
    size: number = 10,
    sort: string = 'nombre',
    pais?: string
  ): Observable<RespuestaPaginada<Destino>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort);
    
    if (pais?.trim()) {
      params = params.set('pais', pais.trim());
    }

    return this.http.get<RespuestaPaginada<Destino>>(this.apiUrl, { params });
  }

  getDestino(id: number): Observable<Destino> {
    return this.http.get<Destino>(`${this.apiUrl}/${id}`);
  }

  createDestino(destino: Destino): Observable<Destino> {
    return this.http.post<Destino>(this.apiUrl, destino);
  }

  updateDestino(id: number, destino: Destino): Observable<Destino> {
    return this.http.put<Destino>(`${this.apiUrl}/${id}`, destino);
  }

  deleteDestino(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
