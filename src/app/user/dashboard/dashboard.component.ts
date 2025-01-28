import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from 'src/app/shared/api.service';
import { Account } from 'src/app/shared/models/account.model';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { User } from 'src/app/shared/models/user.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user: User = {};
  accounts: Account[] = [];
  currentGlobalBalance: number = 0;
  transactions: Transaction[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.user = user;

    this.apiService.getUserAccounts(user.id).subscribe(
      (response) => {
        this.accounts = response;

        if (this.accounts.length > 0) {
          const firstAccountId = this.accounts[0].id;

          this.currentGlobalBalance = this.accounts.reduce((sum, account) => sum + account.balance, 0);

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
