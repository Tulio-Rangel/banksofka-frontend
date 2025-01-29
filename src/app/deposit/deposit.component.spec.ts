import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositComponent } from './deposit.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../shared/api.service';
import { of, throwError } from 'rxjs';

describe('DepositComponent', () => {
  let component: DepositComponent;
  let fixture: ComponentFixture<DepositComponent>;
  let apiService: ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ReactiveFormsModule],
      declarations: [DepositComponent],
      providers: [ApiService]
    });
    fixture = TestBed.createComponent(DepositComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the deposit form with an empty amount', () => {
    expect(component.depositForm.value).toEqual({ amount: null });
  });

  it('should be invalid when amount is empty or less than 1', () => {
    const amountControl = component.depositForm.get('amount');
  
    amountControl?.setValue(null);
    expect(component.depositForm.invalid).toBeTrue();
  
    amountControl?.setValue(0);
    expect(component.depositForm.invalid).toBeTrue();
  
    amountControl?.setValue(-5);
    expect(component.depositForm.invalid).toBeTrue();
  });

  it('should be valid when a positive amount is entered', () => {
    component.depositForm.get('amount')?.setValue(100);
    expect(component.depositForm.valid).toBeTrue();
  });

  it('should call createDeposit when form is submitted', () => {
    spyOn(apiService, 'createDeposit').and.callFake(() => of({}));
  
    component.accounts = [{ id: '1' }]; 
    component.depositForm.get('amount')?.setValue(1000);
    
    component.onSubmit();
  
    expect(apiService.createDeposit).toHaveBeenCalledWith('1', jasmine.objectContaining({ amount: 1000 }));
  });

  it('should log an error message when deposit fails', () => {
    spyOn(console, 'error');
    spyOn(component['apiService'], 'createDeposit').and.returnValue(throwError(() => new Error('Server error')));
  
    component.accounts = [{ id: '1' }];
    component.depositForm.get('amount')?.setValue(100);
    
    component.onSubmit();
  
    expect(console.error).toHaveBeenCalledWith('Error al depositar:', jasmine.any(Error));
  });

  it('should reset the form after a successful deposit', () => {
    spyOn(component['apiService'], 'createDeposit').and.returnValue(of({}));
  
    component.accounts = [{ id: '1' }];
    component.depositForm.get('amount')?.setValue(500);
    
    component.onSubmit();
  
    expect(component.depositForm.value.amount).toBeNull();
  });
});
