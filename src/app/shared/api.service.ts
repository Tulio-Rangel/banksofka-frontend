import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthResponse } from './models/auth-response.model';
import { User } from './models/user.model';
import { Transaction } from './models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8080/api';

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

  getTransactionsHistory(accountId: string): Observable<Transaction[]> {
    const headers = this.getHeaders();
    return this.http.get<Transaction[]>(`${this.apiUrl}/accounts/${accountId}/transactions`, { headers });
  }
}
