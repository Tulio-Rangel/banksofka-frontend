import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeComponent } from './welcome.component';
import { ApiService } from 'src/app/shared/api.service';
import { of, throwError } from 'rxjs';
import { TransactionStreamService } from 'src/app/notifications/transaction-stream.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('WelcomeComponent', () => {
  let component: WelcomeComponent;
  let fixture: ComponentFixture<WelcomeComponent>;
  let apiService;
  let transactionStreamService: jasmine.SpyObj<TransactionStreamService>;

  beforeEach(() => {
    const transactionStreamServiceSpy = jasmine.createSpyObj('TransactionStreamService', ['getTransactionStream']);
    transactionStreamServiceSpy.getTransactionStream.and.returnValue(of(null));

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [WelcomeComponent],
      providers: [
        ApiService,
        { provide: TransactionStreamService, useValue: transactionStreamServiceSpy }
      ]
    });
    fixture = TestBed.createComponent(WelcomeComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService);
    transactionStreamService = TestBed.inject(TransactionStreamService) as jasmine.SpyObj<TransactionStreamService>;;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display user name', () => {
    const mockUser = { token: 'valid-token', name: 'John Doe', email: 'test@example.com', id: 123 };
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(mockUser));
    fixture.detectChanges();
    const nameElement: HTMLElement = fixture.nativeElement.querySelector('h1');
    expect(nameElement).toBeTruthy();
    expect(nameElement.textContent).toContain('¡Hola, John Doe!');
  });

  it('should display current balance', () => {
    component.accounts = [{ accountNumber: '1234567890' }];
    const mockTransaction = { id: 1, date: new Date(), transactionType: 'Deposit', amount: 100, initialBalance: 500, finalBalance: 600 };
    transactionStreamService.getTransactionStream.and.returnValue(of(mockTransaction));
    fixture.detectChanges();
    const balanceElement: HTMLElement = fixture.nativeElement.querySelector('.p-balance');
    expect(balanceElement).toBeTruthy();
    expect(balanceElement.textContent).toContain('$600.00');
  });

  it('should display user accounts', () => {
    component.accounts = [
      { accountNumber: '1234567890' },
      { accountNumber: '0987654321' }
    ];
    fixture.detectChanges();
    const accountElements: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('.account-item');
    expect(accountElements.length).toBe(2);
    expect(accountElements[0].textContent).toContain('1234567890');
    expect(accountElements[1].textContent).toContain('0987654321');
  });

  it('should subscribe to transaction stream on init', () => {
    transactionStreamService.getTransactionStream.and.returnValue(of(null));
    fixture.detectChanges();
    expect(transactionStreamService.getTransactionStream).toHaveBeenCalled();
  });

  it('should update balance when a transaction is received', () => {
    const mockTransaction = { id: 1, date: new Date(), transactionType: 'Deposit', amount: 100, initialBalance: 500, finalBalance: 600 };
    transactionStreamService.getTransactionStream.and.returnValue(of(mockTransaction));
    fixture.detectChanges();
    expect(component.currentBalance).toBe(600);
  });

  it('should log an error when transaction stream fails', () => {
    spyOn(console, 'error');
    transactionStreamService.getTransactionStream.and.returnValue(throwError(() => new Error('Stream error')));
    fixture.detectChanges();
    expect(console.error).toHaveBeenCalledWith('Error en el stream:', jasmine.any(Error));
  });
});
