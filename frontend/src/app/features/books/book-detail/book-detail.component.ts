import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, ResolveFn } from '@angular/router';
import { BookService } from '../book.service';
import { CurrencyPipe } from '@angular/common';
import { catchError, debounceTime, map, of, Subject, switchMap } from 'rxjs';
import { CartService } from '../../../core/services/cart.service';
import { Book } from '../../../types/types';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css'],
})
export class BookDetailComponent implements OnInit {
  private cartService = inject(CartService);
  private bookService = inject(BookService);
  private destroyRef = inject(DestroyRef);
  private route = inject(ActivatedRoute);
  private bookId = this.route.snapshot.paramMap.get('bookId');
  private addToCartSubject = new Subject<{
    bookId: number;
  }>();
  book = this.bookService.book;
  loading = signal<boolean>(true);
  error = signal<string>('');

  ngOnInit(): void {
    this.error.set('');
    this.loading.set(true);

    const subscription = this.bookService.getBookById(+this.bookId!).subscribe({
      error: (error) => {
        this.error.set(error.error.message);
        this.loading.set(false);
      },
      complete: () => this.loading.set(false),
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());

    /////////

    this.addToCartSubject
      .pipe(
        debounceTime(300),
        switchMap(({ bookId }) => this.cartService.addBook(bookId, 1, 'add'))
      )
      .subscribe();
  }

  onAddToCart(): void {
    this.addToCartSubject.next({ bookId: this.book().id });
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
