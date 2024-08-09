import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { OrderDetail, OrderById } from '../../types/types';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/order/history`;
  private http = inject(HttpClient);

  private orders_ = signal<OrderDetail[]>([]);
  private order_ = signal<OrderById>({} as OrderById);

  orders = this.orders_.asReadonly();
  order = this.order_.asReadonly();

  getHistory(): Observable<OrderDetail[]> {
    return this.http
      .get<OrderDetail[]>(`${this.apiUrl}`)
      .pipe(tap({ next: (results) => this.orders_.set(results) }));
  }

  getHistoryById(orderId: number): Observable<OrderById> {
    return this.http
      .get<OrderById>(`${this.apiUrl}/${orderId}`)
      .pipe(tap({ next: (results) => this.order_.set(results) }));
  }

  setAllOrdersForDashboard(orders: OrderDetail[]): void {
    this.orders_.set(orders);
  }
}
