import { Component } from '@angular/core';
import { BookListComponent } from '../../../features/books/book-list/book-list.component';
import { AddUpdateBookComponent } from '../../../features/dashboard/add-update-book/add-update-book.component';

@Component({
  selector: 'app-add-book-page',
  standalone: true,
  imports: [BookListComponent, AddUpdateBookComponent],
  templateUrl: './add-book-page.component.html',
  styleUrl: './add-book-page.component.css',
})
export class AddBookPageComponent {}
