import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataPackage } from '../data-package';

@Injectable({
  providedIn: 'root'
})
export class CintaService {

  private cintaUrl = 'rest/cinta';

  constructor(
    private http: HttpClient
  ) { }

  obtenerCinta(): Observable<DataPackage> {
    return this.http.get<DataPackage>(this.cintaUrl);
  }

  escribirCinta(cinta: string[]): Observable<DataPackage> {
    return this.http.post<DataPackage>(`${this.cintaUrl}/escribir`, cinta);
  }
  borrarCinta(cinta: string[]): Observable<DataPackage> {
    return this.http.post<DataPackage>(`${this.cintaUrl}/borrar`, cinta);
  }

}