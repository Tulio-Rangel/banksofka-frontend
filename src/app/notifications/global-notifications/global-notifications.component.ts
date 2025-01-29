import { Component, OnInit } from '@angular/core';
import { TransactionStreamService } from '../transaction-stream.service';

@Component({
  selector: 'app-global-notifications',
  templateUrl: './global-notifications.component.html',
  styleUrls: ['./global-notifications.component.css']
})
export class GlobalNotificationsComponent implements OnInit {
  transactions: any[] = [];

  constructor(private transactionStreamService: TransactionStreamService) {}

  ngOnInit(): void {
    this.transactionStreamService.getTransactionStream().subscribe({
      next: (transaction) => {
        this.transactions.unshift(transaction);
        setTimeout(() => {
          this.transactions.pop();
        }, 5000);
      },
      error: (error) => console.error('Error en el stream:', error)
    });
  }

}
