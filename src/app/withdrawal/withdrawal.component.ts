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

  constructor(private apiService: ApiService, private formBuilder: FormBuilder, private transactionStreamService: TransactionStreamService) {

      this.withdrawalForm = this.formBuilder.group({
        amount: [null, [Validators.required, Validators.min(1)]],
      });
    }
  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.user = user;

    this.apiService.getUserAccounts(this.user.id).subscribe({
      next: (response) => this.accounts = response,
      error: (error) => console.error('Error fetching accounts', error)
      });
  }

  onSubmit(): void {
    if (this.withdrawalForm.valid) {
      const body = this.withdrawalForm.value
      console.warn('Retiro hecho', this.withdrawalForm.value);
      this.apiService.createWithdrawal(this.accounts[0].id, this.withdrawalForm.value).subscribe({
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
