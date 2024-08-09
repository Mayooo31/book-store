import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Genre, GetAllOrdersResults, Statistics } from '../../types/types';

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

  getAllOrders(
    page: number = 1,
    limit: number = 30
  ): Observable<GetAllOrdersResults> {
    return this.http.get<GetAllOrdersResults>(
      `${this.apiUrl}/orders?page=${page}&limit=${limit}`
    );
  }

  changeStatusOfOrder(
    orderId: number,
    status: string
  ): Observable<{ message: string }> {
    return this.http
      .patch<{ message: string }>(`${this.apiUrl}/orders/${orderId}/status`, {
        status,
      })
      .pipe(
        tap({
          next: (results) => this.toastr.success(results.message),
          error: () => this.toastr.error('Status was not changed!'),
        })
      );
  }

  addBook(book: any): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(`${this.apiUrl}/books/add`, book);
  }

  updateBook(bookId: number, book: any): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(
      `${this.apiUrl}/books/${bookId}`,
      book
    );
  }

  getStatistics(): Observable<Statistics> {
    return this.http
      .get<Statistics>(this.apiUrl + '/statistics')
      .pipe(tap({ next: (results) => this.statistics_.set(results) }));
  }

  getGenres(): Observable<Genre[]> {
    return this.http
      .get<Genre[]>(this.apiUrl + '/genres')
      .pipe(tap({ next: (results) => this.genres_.set(results) }));
  }
}
