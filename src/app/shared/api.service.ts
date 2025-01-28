import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthResponse } from '../auth/models/auth-response.model';
import { User } from '../auth/models/user.model';
import { AuditTransaction } from '../auth/models/audit-transaction';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8080/api';
  private eventSource!: EventSource;

  constructor(private http: HttpClient) { }

  getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, { email, password });
  }

  register(user: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, user);
  }

  getUserAccounts(userId: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${this.apiUrl}/users/${userId}/accounts`, { headers });
  }

  getTransactionStream(): Observable<AuditTransaction> {
    return new Observable(observer => {
      this.eventSource = new EventSource('http://localhost:8081/api/audit/transactions/stream');

      this.eventSource.onmessage = (event) => {
        const transaction: AuditTransaction = JSON.parse(event.data);
        observer.next(transaction);
      };

      this.eventSource.onerror = (error) => {
        console.error('Error en EventSource:', error);
        observer.error(error);
      };
    });
  }

}
