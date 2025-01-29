import { TransactionStreamService } from './../../notifications/transaction-stream.service';
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
  currentBalance: number = 0;
  transactions: any[] = [];

  constructor(private apiService: ApiService, private transactionStreamService: TransactionStreamService) { }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.user = user;

    this.apiService.getUserAccounts(this.user.id).subscribe({
      next: (response) => this.accounts = response,
      error: (error) => console.error('Error fetching accounts', error)
    });

    this.transactionStreamService.getTransactionStream().subscribe({
      next: (transaction) => {
        if (!transaction) return;
        
        this.transactions.unshift(transaction);
        this.currentBalance = transaction.finalBalance;
      },
      error: (error) => console.error('Error en el stream:', error)
    });

  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
}
