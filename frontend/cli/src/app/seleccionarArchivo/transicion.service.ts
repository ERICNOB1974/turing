import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataPackage } from '../data-package';

@Injectable({
  providedIn: 'root'
})
export class TransicionesService {

  private baseUrl = 'rest/transiciones';  // Aquí cambió la URL para reflejar el endpoint correcto

  constructor(private http: HttpClient) {}

  /**
   * Método para obtener las transiciones del backend
   */
  obtenerTransiciones(): Observable<DataPackage> {
    return this.http.get<DataPackage>(this.baseUrl);
  }

  /**
   * Método para actualizar la ruta del archivo de transiciones en el backend
   * param nuevaRuta La nueva ruta del archivo
   */
  actualizarRutaArchivo(nuevaRuta: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/setRuta`, nuevaRuta);
  }

  obtenerArchivosCargados(): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.baseUrl}/archivos`);
  }


  /**
   * Método para obtener las transiciones del backend
   */
  obtenerContenidoArchivo(nombreArchivo:string): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.baseUrl}/contenido/${nombreArchivo}`);
  }

  subirArchivo(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/subir-archivo`, formData);
  }
}
