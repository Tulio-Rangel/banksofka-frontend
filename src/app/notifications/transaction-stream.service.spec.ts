import { TestBed } from '@angular/core/testing';

import { TransactionStreamService } from './transaction-stream.service';

describe('TransactionStreamService', () => {
  let service: TransactionStreamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransactionStreamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize the transaction stream correctly', () => {
    expect(service.getTransactionStream()).toBeTruthy();
  });

  it('should receive and emit transaction updates', (done) => {
    const mockTransaction = { id: 1, amount: 100 };

    service.getTransactionStream().subscribe((transaction) => {
      if (transaction) {
        expect(transaction).toEqual(mockTransaction);
        done();
      }
    });

    const mockEvent = new MessageEvent('message', { data: JSON.stringify(mockTransaction) });
    (service as any).eventSource.onmessage(mockEvent);
  });

  it('should handle SSE errors and close the connection', () => {
    spyOn(console, 'error');
    spyOn((service as any).eventSource, 'close').and.callThrough();

    const mockError = new Event('error');
    (service as any).eventSource.onerror(mockError);

    expect(console.error).toHaveBeenCalledWith('Error en SSE:', mockError);
    expect((service as any).eventSource.close).toHaveBeenCalled();
  });

  it('should share the latest transaction with new subscribers', (done) => {
    const mockTransaction = { id: 2, amount: 200 };

    (service as any).transactionSubject.next(mockTransaction);

    service.getTransactionStream().subscribe((transaction) => {
      expect(transaction).toEqual(mockTransaction);
      done();
    });
  });
});
