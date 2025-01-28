import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuditTransaction } from 'src/app/auth/models/audit-transaction';
import { ApiService } from 'src/app/shared/api.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  user: any;
  accounts: any[] = [];
  transactions: AuditTransaction[] = [];
  private transactionSubscription!: Subscription;


  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef) { }

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

    this.transactionSubscription = this.apiService.getTransactionStream().subscribe(
      (transaction: AuditTransaction) => {
        this.transactions.unshift(transaction);
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error receiving transaction stream:', error.message || error);
      }
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
}
