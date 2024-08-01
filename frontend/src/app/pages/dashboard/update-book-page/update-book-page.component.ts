import { Component } from '@angular/core';
import { AddUpdateBookComponent } from '../../../features/dashboard/add-update-book/add-update-book.component';

@Component({
  selector: 'app-update-book-page',
  standalone: true,
  imports: [AddUpdateBookComponent],
  templateUrl: './update-book-page.component.html',
  styleUrl: './update-book-page.component.css',
})
export class UpdateBookPageComponent {}
