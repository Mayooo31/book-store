import {
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { Book } from '../../../../../types/types';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../../../../core/services/cart.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../../../../../core/services/auth.service';
import { BookService } from '../../../book.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-book-item',
  standalone: true,
  imports: [
    CurrencyPipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './book-item.component.html',
  styleUrls: ['./book-item.component.css'],
})
export class BookItemComponent implements OnInit {
  private bookService = inject(BookService);
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private addToCartSubject = new Subject<{
    bookId: number;
  }>();
  book = input<Book>({} as Book);
  loading = signal(false);

  ngOnInit() {
    this.addToCartSubject
      .pipe(
        debounceTime(300),
        switchMap(({ bookId }) =>
          this.cartService.addBook(bookId, 1, 'add').pipe(
            tap({
              error: () => this.loading.set(false),
              complete: () => this.loading.set(false),
            })
          )
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  onAddToCart(event: Event): void {
    event.stopPropagation();
    this.loading.set(true);
    this.addToCartSubject.next({ bookId: this.book().id });
  }

  onGetBookById(bookId: number): void {
    this.router.navigate(['books', bookId]);
  }

  onDeleteBook(event: Event) {
    event.stopPropagation();
    this.bookService
      .deleteBook(this.book().id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  goToUpdatePage(event: Event) {
    event.stopPropagation();
    this.router.navigate(['dashboard/update-book', this.book().id]);
  }

  isAdminManageBooks() {
    return this.authService.isAdminManageBooks();
  }
}
