import { Component } from '@angular/core';
import { BookDetailComponent } from '../../../features/books/book-detail/book-detail.component';

@Component({
  selector: 'app-book-detail-page',
  standalone: true,
  imports: [BookDetailComponent],
  templateUrl: './book-detail-page.component.html',
  styleUrl: './book-detail-page.component.css',
})
export class BookDetailPageComponent {}
