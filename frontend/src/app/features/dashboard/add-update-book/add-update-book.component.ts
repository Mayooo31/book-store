import { Component, inject, OnInit, Renderer2, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../dashboard.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../../books/book.service';
import { Book } from '../../../types/types';
import { minSelectedGenres } from '../../../validators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-update-book',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-update-book.component.html',
  styleUrls: ['./add-update-book.component.css'],
})
export class AddUpdateBookComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private bookService = inject(BookService);
  private route = inject(ActivatedRoute);
  private bookId = this.route.snapshot.paramMap.get('bookId');
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);
  genres = this.dashboardService.genres;
  isUpdating = this.router.url.includes('update-book');
  bookForm: FormGroup;
  error = signal('');

  constructor() {
    this.bookForm = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(50)]],
      price: ['', [Validators.required, Validators.min(5)]],
      yearPublished: ['', [Validators.required, Validators.min(1)]],
      coverImage: ['', Validators.required],
      pages: ['', [Validators.required, Validators.min(1)]],
      rating: ['', [Validators.required, Validators.min(0), Validators.max(5)]],
      isAvailable: [false],
      genres: this.fb.array([], [minSelectedGenres(1, 3)]),
    });
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);

    this.dashboardService.getGenres().subscribe();

    if (this.isUpdating) {
      this.bookService.getBookById(+this.bookId!).subscribe({
        next: (results: Book) => {
          this.bookForm.patchValue({
            title: results.title,
            author: results.author,
            description: results.description,
            price: results.price,
            yearPublished: results.year_published,
            coverImage: results.cover_image,
            pages: results.pages,
            rating: results.rating,
            isAvailable: results.is_available,
          });

          const genresControl = this.bookForm.get('genres') as FormArray;
          results.genres.forEach((genreName) => {
            const genre = this.genres().find((g) => g.genre === genreName);
            if (genre) {
              genresControl.push(this.fb.control(genre.id));
            }
          });
        },
      });
    }
  }

  getValidity(controlName: string): boolean {
    const control = this.bookForm.get(controlName);
    return control!.touched && control!.dirty && control!.invalid;
  }

  toggleGenre(genreId: number): void {
    const genresControl = this.bookForm.get('genres') as FormArray;
    const index = genresControl.value.indexOf(genreId);
    if (index > -1) {
      genresControl.removeAt(index);
    } else {
      genresControl.push(this.fb.control(genreId));
    }
  }

  isGenreSelected(genreId: number): boolean {
    const genresControl = this.bookForm.get('genres') as FormArray;
    return genresControl.value.includes(genreId);
  }

  onSubmit(): void {
    this.error.set('');
    if (!this.bookForm.valid) return;

    if (this.isUpdating) {
      this.dashboardService
        .updateBook(+this.bookId!, this.bookForm.value)
        .subscribe({
          error: (err) => {
            this.error.set('Something happend. Please try again later!');
          },
          next: (results) => {
            this.router.navigate(['books', this.bookId]);
            this.toastr.success('Successfully updated a book.');
          },
        });
    } else {
      this.dashboardService.addBook(this.bookForm.value).subscribe({
        error: (err) =>
          this.error.set('Something happend. Please try again later!'),
        next: (results: { id: string }) => {
          this.router.navigate(['books', results.id]);
          this.toastr.success('Successfully added a book.');
        },
      });
    }
  }
}
