import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalNotificationsComponent } from './global-notifications.component';
import { TransactionStreamService } from '../transaction-stream.service';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('GlobalNotificationsComponent', () => {
  let component: GlobalNotificationsComponent;
  let fixture: ComponentFixture<GlobalNotificationsComponent>;
  let transactionStreamService: jasmine.SpyObj<TransactionStreamService>;

  beforeEach(() => {
    const transactionStreamServiceSpy = jasmine.createSpyObj('TransactionStreamService', ['getTransactionStream']);

    TestBed.configureTestingModule({
      declarations: [GlobalNotificationsComponent],
      providers: [{ provide: TransactionStreamService, useValue: transactionStreamServiceSpy }]
    });
    fixture = TestBed.createComponent(GlobalNotificationsComponent);
    component = fixture.componentInstance;
    transactionStreamService = TestBed.inject(TransactionStreamService) as jasmine.SpyObj<TransactionStreamService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to transaction stream on init', () => {
    transactionStreamService.getTransactionStream.and.returnValue(of(null));
    fixture.detectChanges();
    expect(transactionStreamService.getTransactionStream).toHaveBeenCalled();
  });

  it('should add a new transaction to the list', () => {
    const mockTransaction = { id: 1, date: new Date(), transactionType: 'Deposit', amount: 100, initialBalance: 500, finalBalance: 600 };
    transactionStreamService.getTransactionStream.and.returnValue(of(mockTransaction));
    fixture.detectChanges();
    expect(component.transactions.length).toBe(1);
    expect(component.transactions[0]).toEqual(mockTransaction);
  });

  it('should remove the transaction after 5 seconds', (done) => {
    jasmine.clock().install();
    const mockTransaction = { id: 1, date: new Date(), transactionType: 'Withdrawal', amount: 50, initialBalance: 500, finalBalance: 450 };
    transactionStreamService.getTransactionStream.and.returnValue(of(mockTransaction));
    fixture.detectChanges();
    expect(component.transactions.length).toBe(1);
    jasmine.clock().tick(5001);
    expect(component.transactions.length).toBe(0);
    jasmine.clock().uninstall();
    done();
  });

  it('should render the transaction details in the template', () => {
    const mockTransaction = { id: 2, date: new Date(), transactionType: 'Transfer', amount: 200, initialBalance: 800, finalBalance: 1000 };
    transactionStreamService.getTransactionStream.and.returnValue(of(mockTransaction));
    fixture.detectChanges();
    const transactionElement = fixture.debugElement.query(By.css('.notification-body')).nativeElement;
    expect(transactionElement.textContent).toContain(`ID: ${mockTransaction.id}`);
    expect(transactionElement.textContent).toContain(`$${mockTransaction.amount}`);
    expect(transactionElement.textContent).toContain(`${mockTransaction.transactionType.toLowerCase()}`);
  });

  it('should log an error when transaction stream fails', () => {
    spyOn(console, 'error');
    transactionStreamService.getTransactionStream.and.returnValue(throwError(() => new Error('Stream error')));
    fixture.detectChanges();
    expect(console.error).toHaveBeenCalledWith('Error en el stream:', jasmine.any(Error));
  });
});
