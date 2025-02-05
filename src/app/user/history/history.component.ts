import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/api.service';
import { Transaction } from 'src/app/shared/models/transaction.model';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  user: any;
  accounts: any[] = [];
  transactions: Transaction[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.user = user;

    this.apiService.getUserAccounts(this.user.id).subscribe({
      next: (response) => {
        this.accounts = response;

        if (this.accounts.length > 0) {
          const firstAccountId = this.accounts[0].id;

          this.apiService.getTransactionsHistory(firstAccountId).subscribe(
            (transactions) => {
              this.transactions = transactions;
            },
            (error) => {
              console.error('Error fetching transactions', error);
            }
          );

        } else {
          console.warn('No accounts found for the user');
        }
      },
      error: (error) => console.error('Error fetching accounts', error)
    });

  }
}
