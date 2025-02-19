import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../shared/api.service';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.css']
})

export class DepositComponent implements OnInit{
  depositForm: FormGroup;
  user: any;
  accounts: any[] = [];

  constructor(private readonly apiService: ApiService, private readonly formBuilder: FormBuilder) {

    this.depositForm = this.formBuilder.group({
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
  }

  onSubmit(): void {
    if(this.depositForm.valid){
      const body = this.depositForm.value;
      console.warn('Deposito hecho', body);
      this.apiService.createDeposit(this.accounts[0].id, body).subscribe({
        next: (response) => {
          console.log('Depósito exitoso:', response);
          this.depositForm.reset();
        },
        error: (error) => {
          console.error('Error al depositar:', error);
          console.warn('Error al procesar depósito');
        }
      });
    }
  }
}


