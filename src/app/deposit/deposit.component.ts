import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../shared/api.service';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.css']
})

export class DepositComponent{
  depositForm: FormGroup;

  constructor(private apiService: ApiService, private formBuilder: FormBuilder) {
    this.depositForm = this.formBuilder.group({
      amount: [null, [Validators.required, Validators.min(1)]],
    });
  }

  onSubmit(): void {
    if(this.depositForm.valid){
      const body = this.depositForm.value
      console.warn('Deposito hecho', this.depositForm.value)
      this.apiService.createDeposit('1',this.depositForm.value).subscribe({
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


