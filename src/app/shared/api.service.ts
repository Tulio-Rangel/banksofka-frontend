import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthResponse } from '../auth/models/auth-response.model';
import { User } from '../auth/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, { email, password });
  }

  register(user: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, user);
  }

  getUserAccounts(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${userId}/accounts`);
  }
}
