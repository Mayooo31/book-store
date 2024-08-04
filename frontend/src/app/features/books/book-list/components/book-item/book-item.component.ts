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
import { debounceTime, switchMap } from 'rxjs/operators';
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
  private destroyRef = inject(DestroyRef);
  private addToCartSubject = new Subject<{
    bookId: number;
  }>();
  book = input<Book>({} as Book);

  ngOnInit() {
    const subscription = this.addToCartSubject
      .pipe(
        debounceTime(300),
        switchMap(({ bookId }) => this.cartService.addBook(bookId, 1, 'add'))
      )
      .subscribe();
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  onAddToCart(event: Event): void {
    event.stopPropagation();
    this.addToCartSubject.next({ bookId: this.book().id });
  }

  onGetBookById(bookId: number): void {
    this.router.navigate(['books', bookId]);
  }

  onDeleteBook(event: Event) {
    event.stopPropagation();
    const subscription = this.bookService
      .deleteBook(this.book().id)
      .subscribe();
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  goToUpdatePage(event: Event) {
    event.stopPropagation();
    this.router.navigate(['dashboard/update-book', this.book().id]);
  }

  isAdminManageBooks() {
    return this.authService.isAdminManageBooks();
  }
}
