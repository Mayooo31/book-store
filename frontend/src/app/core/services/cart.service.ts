import { computed, inject, Injectable, signal, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { type Cart } from '../../types/types';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './auth.service';
import { initialCart } from '../../constants';
import { catchError, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = `${environment.apiUrl}/cart`;
  private http = inject(HttpClient);
  private toastr = inject(ToastrService);
  private injector = inject(Injector);
  private cart_ = signal<Cart>(initialCart);

  // using injector because two services use each other and that can cause a loop
  private _authService?: AuthService;
  private get authService(): AuthService {
    if (!this._authService) {
      this._authService = this.injector.get(AuthService);
    }
    return this._authService;
  }

  cart = this.cart_.asReadonly();
  totalItemsInCart = computed(() =>
    this.cart().items.reduce((total, item) => total + item.quantity, 0)
  );

  addBook(
    bookId: number,
    quantity: number = 1,
    operation: 'add' | 'set'
  ): Observable<any> {
    if (!this.authService.isLoggedIn()) {
      this.toastr.error('To add items into cart you have to login...');
      return of(null);
    }

    if (operation === 'add') {
      const item = this.cart_().items.find((item) => item.book_id === bookId);
      if (item && item.quantity === 10) {
        this.toastr.error('You can have a maximum of 10 pieces of one item.');
        return of(null);
      }
    }

    return this.http
      .post<any>(`${this.apiUrl}/add`, {
        bookId,
        quantity,
        operation,
      })
      .pipe(
        switchMap(() => this.viewCart()), // Automatically refresh the cart after adding a book
        catchError((error) => {
          this.toastr.error(
            'An error occurred while adding the book to the cart.'
          );
          return of(null);
        })
      );
  }

  deleteBook(bookId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${bookId}`).pipe(
      switchMap(() => this.viewCart()), // Automatically refresh the cart after deleting a book
      catchError((error) => {
        this.toastr.error(
          'An error occurred while deleting the book from the cart.'
        );
        return of(null);
      })
    );
  }

  deleteAllBooksFromCart(): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}`).pipe(
      switchMap(() => this.viewCart()), // Automatically refresh the cart after deleting all books
      catchError((error) => {
        this.toastr.error('An error occurred while clearing the cart.');
        return of(null);
      })
    );
  }

  viewCart(): Observable<any> {
    return this.http.get<Cart>(`${this.apiUrl}`).pipe(
      tap({
        next: (results) => this.cart_.set(results),
      }),
      catchError((error) => {
        this.toastr.error('An error occurred while fetching the cart.');
        return of(null);
      })
    );
  }

  getTotalItemsInCart(): Observable<any> {
    return this.http.get<{ total_items: string }>(`${this.apiUrl}/total-items`);
  }

  checkout(shippingAddress: string, paymentMethod: string): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/checkout`, {
        shippingAddress,
        paymentMethod,
      })
      .pipe(
        catchError((error) => {
          this.toastr.error('An error occurred during checkout.');
          return of(null);
        })
      );
  }

  removeCart() {
    this.cart_.set(initialCart);
  }
}
