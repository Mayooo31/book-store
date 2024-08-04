import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, ResolveFn } from '@angular/router';
import { BookService } from '../book.service';
import { CurrencyPipe } from '@angular/common';
import {
  catchError,
  debounceTime,
  map,
  of,
  Subject,
  Subscription,
  switchMap,
  tap,
} from 'rxjs';
import { CartService } from '../../../core/services/cart.service';
import { Book } from '../../../types/types';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css'],
})
export class BookDetailComponent implements OnInit, OnDestroy {
  private cartService = inject(CartService);
  private bookService = inject(BookService);
  private route = inject(ActivatedRoute);
  private bookId = this.route.snapshot.paramMap.get('bookId');
  private addToCartSubject = new Subject<{
    bookId: number;
  }>();
  book = this.bookService.book;
  loading = signal<boolean>(true);
  addBookLoading = signal<boolean>(false);
  error = signal<string>('');

  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.error.set('');
    this.loading.set(true);

    const getBookSubscription = this.bookService
      .getBookById(+this.bookId!)
      .subscribe({
        error: (error) => {
          this.error.set(error.error.message);
          this.loading.set(false);
        },
        complete: () => this.loading.set(false),
      });

    this.subscriptions.push(getBookSubscription);

    /////////

    const addBookSubscription = this.addToCartSubject
      .pipe(
        debounceTime(300),
        switchMap(({ bookId }) =>
          this.cartService.addBook(bookId, 1, 'add').pipe(
            tap({
              error: () => this.addBookLoading.set(false),
              complete: () => this.addBookLoading.set(false),
            })
          )
        )
      )
      .subscribe();

    this.subscriptions.push(addBookSubscription);
  }

  onAddToCart(): void {
    this.addBookLoading.set(true);
    this.addToCartSubject.next({ bookId: this.book().id });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}

export const resolveTitle: ResolveFn<string> = (
  activatedRoute,
  routerState
) => {
  const bookService = inject(BookService);
  const bookId = activatedRoute.paramMap.get('bookId');

  return bookService.getBookById(+bookId!).pipe(
    map((results: Book) => results?.title || 'A book...'),
    catchError(() => of('Book not found'))
  );
};
