import { Component, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CartPaymentFormComponent } from './components/cart-payment-form/cart-payment-form.component';
import { switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CurrencyPipe,
    ReactiveFormsModule,
    CartPaymentFormComponent,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatOptionModule,
    MatButtonModule,
  ],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  cart = this.cartService.cart;
  loading = signal<boolean>(true);
  checkoutLoading = signal<boolean>(false);
  error = signal<string>('');

  form = new FormGroup({
    address: new FormControl('', {
      validators: [Validators.required, Validators.minLength(6)],
    }),
    'credit-card': new FormControl('', {
      validators: [Validators.required, Validators.minLength(19)],
    }),
  });

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.cartService
        .viewCart()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          error: () => {
            this.loading.set(false);
            this.error.set(
              'Something happened... We could not fetch your cart.'
            );
          },
          complete: () => this.loading.set(false),
        });
    }

    this.form
      .get('credit-card')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        if (value !== null && typeof value === 'string') {
          const formattedValue = this.formatCreditCard(value);
          this.form
            .get('credit-card')
            ?.setValue(formattedValue, { emitEvent: false });
        }
      });
  }

  private formatCreditCard(value: string): string {
    value = value.replace(/\D/g, '');

    if (value.length > 16) {
      value = value.slice(0, 16);
    }

    const formattedValue = value.replace(/(\d{4})(?=\d)/g, '$1-');
    return formattedValue;
  }

  onCheckout(): void {
    if (this.form.invalid) return;
    this.checkoutLoading.set(true);

    const address = this.form.value.address;
    const creditCard = this.form.value['credit-card'];

    if (!address || !creditCard) return;

    this.cartService
      .checkout(address, creditCard)
      .pipe(
        switchMap((results) =>
          this.cartService.viewCart().pipe(
            tap(() => {
              this.router.navigate(['order/history', results.orderId]);
            })
          )
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({ complete: () => this.checkoutLoading.set(false) });
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  onGetBookById(bookId: number): void {
    this.router.navigate(['books', bookId]);
  }

  onRemoveAllBooksFromCart() {
    this.cartService
      .deleteAllBooksFromCart()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  onDeleteBook(event: Event, bookId: number): void {
    event.stopPropagation();
    this.cartService
      .deleteBook(bookId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  onSelectionChange(changedQuantity: number, bookId: number) {
    this.cartService
      .addBook(bookId, changedQuantity, 'set')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
