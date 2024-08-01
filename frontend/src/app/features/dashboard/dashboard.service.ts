import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Genre, Statistics } from '../../types/types';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/dashboard`;
  private http = inject(HttpClient);
  private toastr = inject(ToastrService);
  private statistics_ = signal<Statistics>({} as Statistics);
  private genres_ = signal<Genre[]>([] as Genre[]);

  statistics = this.statistics_.asReadonly();
  genres = this.genres_.asReadonly();

  getAllOrders(page: number = 1, limit: number = 30): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/orders?page=${page}&limit=${limit}`
    );
  }

  changeStatusOfOrder(orderId: number, status: string): Observable<any> {
    return this.http
      .patch<any>(`${this.apiUrl}/orders/${orderId}/status`, {
        status,
      })
      .pipe(
        tap({
          complete: () => this.toastr.success('Status successfully changed!'),
          error: () => this.toastr.success('Status was not changed!'),
        })
      );
  }

  addBook(book: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/books/add`, book);
  }

  updateBook(bookId: number, book: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/books/${bookId}`, book);
  }

  getStatistics() {
    return this.http
      .get<Statistics>(this.apiUrl + '/statistics')
      .pipe(tap({ next: (results) => this.statistics_.set(results) }));
  }

  getGenres() {
    return this.http
      .get<Genre[]>(this.apiUrl + '/genres')
      .pipe(tap({ next: (results) => this.genres_.set(results) }));
  }
}
