import { Component } from '@angular/core';
import { BookListComponent } from '../../../features/books/book-list/book-list.component';

@Component({
  selector: 'app-book-list-page',
  standalone: true,
  imports: [BookListComponent],
  templateUrl: './book-list-page.component.html',
  styleUrl: './book-list-page.component.css',
})
export class BookListPageComponent {}
