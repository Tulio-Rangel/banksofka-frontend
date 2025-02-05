import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryComponent } from './history.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ApiService } from 'src/app/shared/api.service';
import { of, throwError } from 'rxjs';

describe('HistoryComponent', () => {
  let component: HistoryComponent;
  let fixture: ComponentFixture<HistoryComponent>;
  let apiService: ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [HistoryComponent],
      providers: [ApiService]
    });
    fixture = TestBed.createComponent(HistoryComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService);
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user from localStorage', () => {
    const mockUser = { token: 'valid-token', name: 'test-user', email: 'test@example.com', id: 123 };
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(mockUser));
    component.ngOnInit();
    expect(component.user).toEqual(mockUser);
  });

  it('should fetch user accounts and transactions if accounts exist', () => {
    const mockUser = { token: 'valid-token', name: 'test-user', email: 'test@example.com', id: 123 };
    const mockAccounts = [{ id: 'acc1' }, { id: 'acc2' }];
    const mockTransactions = [
      { id: 'tx1', date: new Date(), amount: 100, type: 'DEPOSIT' }
    ];

    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(mockUser));
    spyOn(apiService, 'getUserAccounts').and.returnValue(of(mockAccounts));
    spyOn(apiService, 'getTransactionsHistory').and.returnValue(of(mockTransactions));

    component.ngOnInit();

    expect(apiService.getUserAccounts).toHaveBeenCalledWith(mockUser.id);
    expect(component.accounts).toEqual(mockAccounts);
    expect(apiService.getTransactionsHistory).toHaveBeenCalledWith(mockAccounts[0].id);
    expect(component.transactions).toEqual(mockTransactions);
  });

  it('should log a warning if the user has no accounts', () => {
    const mockUser = { token: 'valid-token', name: 'test-user', email: 'test@example.com', id: 123 };
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(mockUser));
    spyOn(apiService, 'getUserAccounts').and.returnValue(of([]));
    spyOn(console, 'warn');

    component.ngOnInit();

    expect(apiService.getUserAccounts).toHaveBeenCalledWith(mockUser.id);
    expect(console.warn).toHaveBeenCalledWith('No accounts found for the user');
  });

  it('should handle API error when fetching accounts', () => {
    const mockUser = { token: 'valid-token', name: 'test-user', email: 'test@example.com', id: 123 };
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(mockUser));
    spyOn(apiService, 'getUserAccounts').and.returnValue(throwError(() => new Error('API Error')));
    spyOn(console, 'error');

    component.ngOnInit();

    expect(apiService.getUserAccounts).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('Error fetching accounts', new Error('API Error'));
  });

  it('should handle API error when fetching transactions', () => {
    const mockUser = { token: 'valid-token', name: 'test-user', email: 'test@example.com', id: 123 };
    const mockAccounts = [{ id: 'acc1' }];

    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(mockUser));
    spyOn(apiService, 'getUserAccounts').and.returnValue(of(mockAccounts));
    spyOn(apiService, 'getTransactionsHistory').and.returnValue(throwError(() => new Error('Transactions API Error')));
    spyOn(console, 'error');

    component.ngOnInit();

    expect(apiService.getTransactionsHistory).toHaveBeenCalledWith(mockAccounts[0].id);
    expect(console.error).toHaveBeenCalledWith('Error fetching transactions', new Error('Transactions API Error'));
  });
});
