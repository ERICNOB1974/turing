import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CintaService {

  private cintaUrl = 'rest/cinta';
  
  constructor(
    private http: HttpClient
  ) { }

  // search(searchTerm: string): Observable<DataPackage> {
  //   return this.http.get<DataPackage>(`${this.proyectosUrl}/search/${searchTerm}`);
  // }

}