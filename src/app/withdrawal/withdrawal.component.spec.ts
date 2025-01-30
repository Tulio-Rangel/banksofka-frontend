import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawalComponent } from './withdrawal.component';
import { ApiService } from '../shared/api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

describe('WithdrawalComponent', () => {
  let component: WithdrawalComponent;
  let fixture: ComponentFixture<WithdrawalComponent>;
  let apiService: ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ReactiveFormsModule],
      declarations: [WithdrawalComponent],
      providers: [ApiService]
    });
    fixture = TestBed.createComponent(WithdrawalComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the deposit form with an empty amount', () => {
    expect(component.withdrawalForm.value).toEqual({ amount: null });
  });

  it('should be invalid when amount is empty or less than 1', () => {
    const amountControl = component.withdrawalForm.get('amount');

    amountControl?.setValue(null);
    expect(component.withdrawalForm.invalid).toBeTrue();

    amountControl?.setValue(0);
    expect(component.withdrawalForm.invalid).toBeTrue();

    amountControl?.setValue(-5);
    expect(component.withdrawalForm.invalid).toBeTrue();
  });

  it('should be valid when a positive amount is entered', () => {
    component.withdrawalForm.get('amount')?.setValue(100);
    expect(component.withdrawalForm.valid).toBeTrue();
  });

  it('should call createDeposit when form is submitted', () => {
    spyOn(apiService, 'createWithdrawal').and.callFake(() => of({}));

    component.accounts = [{ id: '1' }];
    component.currentBalance = 2000;
    component.withdrawalForm.get('amount')?.setValue(1000);

    component.onSubmit();

    expect(apiService.createWithdrawal).toHaveBeenCalledWith('1', jasmine.objectContaining({ amount: 1000 }));
  });

  it('should log an error message when deposit fails', () => {
    spyOn(console, 'error');
    spyOn(component['apiService'], 'createWithdrawal').and.returnValue(throwError(() => new Error('Server error')));

    component.accounts = [{ id: '1' }];
    component.currentBalance = 600;
    component.withdrawalForm.get('amount')?.setValue(100);

    component.onSubmit();

    expect(console.error).toHaveBeenCalledWith('Error al retirar:', jasmine.any(Error));
  });

  it('should reset the form after a successful deposit', () => {
    spyOn(component['apiService'], 'createWithdrawal').and.returnValue(of({}));

    component.accounts = [{ id: '1' }];
    component.currentBalance = 600;
    component.withdrawalForm.get('amount')?.setValue(500);

    component.onSubmit();

    expect(component.withdrawalForm.value.amount).toBeNull();
  });
});
