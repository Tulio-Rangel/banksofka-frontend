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

  constructor(private apiService: ApiService, private transactionStreamService: TransactionStreamService) { }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.user = user;

    this.apiService.getUserAccounts(this.user.id).subscribe({
      next: (response) => {
        this.accounts = response;
        this.currentBalance = this.accounts[0]?.balance || 0;
      },
      error: (error) => console.error('Error fetching accounts', error)
    });

    this.transactionStreamService.getTransactionStream().subscribe({
      next: (transaction) => {
        if (!transaction) return;
        this.currentBalance = transaction.finalBalance;
      },
      error: (error) => console.error('Error en el stream:', error)
    });

  }
}
