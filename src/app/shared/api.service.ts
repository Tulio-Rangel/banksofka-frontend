import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthResponse } from './models/auth-response.model';
import { User } from './models/user.model';
import { Transaction } from './models/transaction.model';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly apiUrl = `${environment.apiUrl}/api`;
  private readonly authApiUrl = `${environment.authApiUrl}/api`;

  constructor(private readonly http: HttpClient) { }

  getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.authApiUrl}/auth/login`, { email, password });
  }

  register(user: User): Observable<any> {
    return this.http.post(`${this.authApiUrl}/users`, user);
  }

  getUserAccounts(userId: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${this.apiUrl}/users/${userId}`, { headers });
  }

  getTransactionsHistory(accountId: string): Observable<Transaction[]> {
    const headers = this.getHeaders();
    return this.http.get<Transaction[]>(`${this.apiUrl}/accounts/${accountId}/transactions`, { headers });
  }

  createDeposit(accountId: string, amount:number) : Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(`${this.apiUrl}/accounts/${accountId}/deposit`, amount, {headers});
  }

  createWithdrawal(accountId: string, amount:number) : Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(`${this.apiUrl}/accounts/${accountId}/withdrawal`, amount,{headers});
  }



}
