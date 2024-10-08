import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL2 } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class BasvurularService {
  private apiUrl = `${API_URL2}/Basvurular`;

  constructor(private http: HttpClient) { }

  // Başvuruları listeleme
  getBasvurular(): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(this.apiUrl, { headers });
  }

  // Başvuru detaylarını alma
  getBasvuru(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers });
  }

  // Başvurudan kullanıcı oluşturma
  createUserFromBasvuru(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/${id}/create-user`, {}, { headers });
  }

  // Authorization header ekleyen yardımcı fonksiyon
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('adminToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
}
