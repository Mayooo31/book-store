import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Book, GetBooksResults } from '../../types/types';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private apiUrl = `${environment.apiUrl}/books`;
  private dashboardUrl = `${environment.apiUrl}/dashboard`;
  private http = inject(HttpClient);
  private books_ = signal<Book[]>([]);
  private book_ = signal<Book>({} as Book);
  private toastr = inject(ToastrService);

  books = this.books_.asReadonly();
  book = this.book_.asReadonly();

  getBooks(page: number = 1, limit: number = 20): Observable<GetBooksResults> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<GetBooksResults>(this.apiUrl, { params }).pipe(
      tap({
        next: (results) => {
          this.books_.set(results.results);
        },
      })
    );
  }

  getBookById(bookId: number): Observable<any> {
    return this.http.get<Book>(`${this.apiUrl}/${bookId}`).pipe(
      tap({
        next: (result) => {
          this.book_.set(result);
        },
      })
    );
  }

  deleteBook(bookId: number): Observable<{ message: string }> {
    return this.http
      .delete<{ message: string }>(`${this.dashboardUrl}/books/${bookId}`)
      .pipe(
        tap({
          next: (results) => {
            this.books_.update((prevBooks) =>
              prevBooks.filter((book) => book.id !== bookId)
            );
            this.toastr.success(results.message);
          },
        })
      );
  }

  getBooksBaseOnSearchInput(inputValue: string) {
    return this.http
      .get<GetBooksResults>(this.apiUrl + '/search?q=' + inputValue)
      .pipe(
        tap({
          next: (results) => this.books_.set(results.results),
        })
      );
  }
}
