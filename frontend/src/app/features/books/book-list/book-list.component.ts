import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { BookService } from '../book.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginationInfo } from '../../../types/types';
import { CurrencyPipe } from '@angular/common';
import { BookItemComponent } from './components/book-item/book-item.component';
import { AuthService } from '../../../core/services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [
    CurrencyPipe,
    BookItemComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinner,
    MatIconModule,
  ],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.css',
})
export class BookListComponent implements OnInit {
  private authService = inject(AuthService);
  private bookService = inject(BookService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  books = this.bookService.books;
  page = signal<number>(0);
  limit = signal<number>(20);
  paginationInfo = signal<PaginationInfo>({} as PaginationInfo);
  loading = signal<boolean>(true);
  error = signal<string>('');

  searchForm = new FormGroup({
    search: new FormControl(''),
  });

  ngOnInit(): void {
    this.searchForm.valueChanges
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
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();

    this.route.queryParams
      .pipe(
        tap({
          next: (params) => {
            this.page.set(+params['page'] || this.page());
            this.limit.set(+params['limit'] || this.limit());

            this.onGetBooks();
          },
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  onGetBooks() {
    this.error.set('');
    this.loading.set(true);

    this.bookService
      .getBooks(this.page() + 1, this.limit())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (results) => {
          const { currentPage, totalPages, totalBooks } = results;
          this.paginationInfo.set({ currentPage, totalPages, totalBooks });
        },
        error: (error) => {
          this.error.set(error.error.message);
          this.loading.set(false);
        },
        complete: () => this.loading.set(false),
      });
  }

  onChangePaginator(event: PageEvent) {
    this.page.set(event.pageIndex);
    this.limit.set(event.pageSize);
    if (event.pageSize > this.paginationInfo().totalBooks) {
      this.page.set(0);
    }
    this.onNavigateToNewParams();
  }

  private onNavigateToNewParams() {
    const isManageBooks = this.authService.isAdminManageBooks();
    const navigateTo = isManageBooks ? 'dashboard/manage-books' : 'books';
    this.router.navigate([navigateTo], {
      queryParams: { page: this.page(), limit: this.limit() },
    });
  }
}
