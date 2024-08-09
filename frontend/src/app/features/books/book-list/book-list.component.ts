import { Component, inject, OnInit, signal } from '@angular/core';
import { BookService } from '../book.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginationInfo } from '../../../types/types';
import { CurrencyPipe } from '@angular/common';
import { BookItemComponent } from './components/book-item/book-item.component';
import { AuthService } from '../../../core/services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, Subscription, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CurrencyPipe, BookItemComponent, ReactiveFormsModule],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.css',
})
export class BookListComponent implements OnInit {
  private authService = inject(AuthService);
  private bookService = inject(BookService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  books = this.bookService.books;
  page = signal<number>(1);
  limit = signal<number>(20);
  paginationInfo = signal<PaginationInfo>({} as PaginationInfo);
  loading = signal<boolean>(true);
  error = signal<string>('');

  searchForm = new FormGroup({
    search: new FormControl(''),
  });

  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    const queryParamsSubscription = this.route.queryParams.subscribe(
      (params) => {
        this.page.set(+params['page'] || this.page());
        this.limit.set(+params['limit'] || this.limit());

        if (this.page() < 1) {
          this.page.set(1);
          this.router.navigate(['books']);
          return;
        }

        this.onGetBooks();
      }
    );
    this.subscriptions.push(queryParamsSubscription);

    const searchFormSubscription = this.searchForm.valueChanges
      .pipe(
        debounceTime(300),
        switchMap((results) =>
          this.bookService.getBooksBaseOnSearchInput(results.search ?? '')
        ),
        tap((results) => {
          const { currentPage, totalPages, totalBooks } = results;
          this.paginationInfo.set({
            currentPage,
            totalPages,
            totalBooks,
          });
        })
      )
      .subscribe();

    this.subscriptions.push(searchFormSubscription);
  }

  onGetBooks() {
    this.error.set('');
    this.loading.set(true);

    const bookSubscription = this.bookService
      .getBooks(this.page(), this.limit())
      .subscribe({
        next: (results) => {
          const { currentPage, totalPages, totalBooks } = results;
          this.paginationInfo.set({ currentPage, totalPages, totalBooks });

          if (currentPage > totalPages) {
            this.page.set(totalPages);
            this.onNavigateToNewParams();
          }
        },
        error: (error) => {
          this.error.set(error.error.message);
          this.loading.set(false);
        },
        complete: () => this.loading.set(false),
      });

    this.subscriptions.push(bookSubscription);
  }

  nextPage(): void {
    this.page.update((prevPage) => prevPage + 1);
    this.onNavigateToNewParams();
  }

  prevPage(): void {
    this.page.update((prevPage) => prevPage - 1);
    this.onNavigateToNewParams();
  }

  private onNavigateToNewParams() {
    const isManageBooks = this.authService.isAdminManageBooks();
    const navigateTo = isManageBooks ? 'dashboard/manage-books' : 'books';
    this.router.navigate([navigateTo], {
      queryParams: { page: this.page(), limit: this.limit() },
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
