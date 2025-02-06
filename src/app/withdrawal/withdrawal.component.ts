import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../shared/api.service';
import { TransactionStreamService } from '../notifications/transaction-stream.service';

@Component({
  selector: 'app-withdrawal',
  templateUrl: './withdrawal.component.html',
  styleUrls: ['./withdrawal.component.css']
})
export class WithdrawalComponent implements OnInit{

  withdrawalForm: FormGroup;
  user: any;
  accounts: any[] = [];
  currentBalance: number = 0;
  errorMessage: string = ''

  constructor(private readonly apiService: ApiService, private readonly formBuilder: FormBuilder, private readonly transactionStreamService: TransactionStreamService) {

      this.withdrawalForm = this.formBuilder.group({
        amount: [null, [Validators.required, Validators.min(1)]],
      });
    }
  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') ?? '{}');
    this.user = user;

    this.apiService.getUserAccounts(this.user.id).subscribe({
      next: (response) => this.accounts = response,
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

  onSubmit(): void {
    if (this.withdrawalForm.valid) {
      const amount = this.withdrawalForm.value;
      const account = this.accounts[0];
      if(!account || amount.amount > this.currentBalance){
        this.errorMessage = 'Error: No tienes suficientes fondos para este retiro.';
        return;
      }

      console.warn('Retiro hecho', amount);
      this.apiService.createWithdrawal(account.id, amount).subscribe({
        next: (response) => {
          console.log('Retiro exitoso:', response);
          this.withdrawalForm.reset();
        },
        error: (error) => {
          console.error('Error al retirar:', error);
          console.warn('Error al procesar retiro');
        }
      });
    }
  }


}
