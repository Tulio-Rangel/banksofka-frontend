import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/api.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  user: any;
  accounts: any[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.user = user;

    this.apiService.getUserAccounts(user.id).subscribe(
      (response) => {
        this.accounts = response;
      },
      (error) => {
        console.error('Error fetching accounts', error);
      }
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
}
