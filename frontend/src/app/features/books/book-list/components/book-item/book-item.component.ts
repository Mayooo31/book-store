import { Component, inject, input, OnInit, signal } from '@angular/core';
import { Book } from '../../../../../types/types';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../../../../core/services/cart.service';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../../../../../core/services/auth.service';
import { BookService } from '../../../book.service';

@Component({
  selector: 'app-book-item',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './book-item.component.html',
  styleUrls: ['./book-item.component.css'],
})
export class BookItemComponent implements OnInit {
  private bookService = inject(BookService);
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private router = inject(Router);
  private addToCartSubject = new Subject<{
    bookId: number;
  }>();
  book = input<Book>({} as Book);
  loading = signal(false);

  private subscriptions: Subscription[] = [];

  ngOnInit() {
    const addBookSubscription = this.addToCartSubject
      .pipe(
        debounceTime(300),
        switchMap(({ bookId }) =>
          this.cartService.addBook(bookId, 1, 'add').pipe(
            tap({
              error: () => this.loading.set(false),
              complete: () => this.loading.set(false),
            })
          )
        )
      )
      .subscribe();
    this.subscriptions.push(addBookSubscription);
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
    const deleteBookSubscription = this.bookService
      .deleteBook(this.book().id)
      .subscribe();
    this.subscriptions.push(deleteBookSubscription);
  }

  goToUpdatePage(event: Event) {
    event.stopPropagation();
    this.router.navigate(['dashboard/update-book', this.book().id]);
  }

  isAdminManageBooks() {
    return this.authService.isAdminManageBooks();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
