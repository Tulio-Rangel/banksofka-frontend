import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionStreamService {
  private reactiveApiUrl = 'http://localhost:8081/api/audit/transactions/stream';
  private eventSource: EventSource = new EventSource(this.reactiveApiUrl);

  constructor(private zone: NgZone) {}

  getTransactionStream(): Observable<any> {
    return new Observable(observer => {

      this.eventSource.onmessage = (event) => {
        const transaction = JSON.parse(event.data);
        
        this.zone.run(() => {
          observer.next(transaction);
        });
      };

      this.eventSource.onerror = (error) => {
        observer.error(error);
        this.eventSource.close();
      };

      return () => {
        this.eventSource.close();
      };
    });
  }
}
