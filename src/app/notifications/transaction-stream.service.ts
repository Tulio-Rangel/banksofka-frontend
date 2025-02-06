import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransactionStreamService {
  private readonly reactiveApiUrl = `${environment.reactiveApiUrl}/api/audit/transactions/stream`;
  private eventSource!: EventSource;
  private readonly transactionSubject = new BehaviorSubject<any>(null);

  constructor(private readonly zone: NgZone) {
    this.startTransactionStream();
  }

  private startTransactionStream(): void {
    this.eventSource = new EventSource(this.reactiveApiUrl);

    this.eventSource.onmessage = (event) => {
      const transaction = JSON.parse(event.data);

      this.zone.run(() => {
        this.transactionSubject.next(transaction);
      });
    };

    this.eventSource.onerror = (error) => {
      console.error('Error en SSE:', error);
      this.eventSource.close();
    };
  }

  getTransactionStream(): Observable<any> {
    return this.transactionSubject.asObservable(); // Devuelve un stream compartido
  }
}
