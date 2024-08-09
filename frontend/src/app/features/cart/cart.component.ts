import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { CartItemComponent } from './components/cart-item/cart-item.component';
import { Router } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CartPaymentFormComponent } from './components/cart-payment-form/cart-payment-form.component';
import { finalize, Subscription, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CartItemComponent,
    CurrencyPipe,
    ReactiveFormsModule,
    CartPaymentFormComponent,
  ],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private router = inject(Router);
  cart = this.cartService.cart;
  loading = signal<boolean>(true);
  checkoutLoading = signal<boolean>(false);
  error = signal<string>('');

  private subscriptions: Subscription = new Subscription();

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
      const cartSubscription = this.cartService.viewCart().subscribe({
        error: (error) => {
          this.loading.set(false);
          this.error.set('Something happened... We could not fetch your cart.');
        },
        complete: () => this.loading.set(false),
      });
      this.subscriptions.add(cartSubscription);
    }

    const creditCardSubscription = this.form
      .get('credit-card')
      ?.valueChanges.subscribe((value) => {
        if (value !== null && typeof value === 'string') {
          const formattedValue = this.formatCreditCard(value);
          this.form
            .get('credit-card')
            ?.setValue(formattedValue, { emitEvent: false });
        }
      });

    if (creditCardSubscription) {
      this.subscriptions.add(creditCardSubscription);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
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

    const checkoutSubscription = this.cartService
      .checkout(address, creditCard)
      .pipe(
        switchMap((results) =>
          this.cartService.viewCart().pipe(
            tap(() => {
              this.router.navigate(['order/history', results.orderId]);
            })
          )
        ),
        finalize(() => this.checkoutLoading.set(false))
      )
      .subscribe();

    this.subscriptions.add(checkoutSubscription);
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  onGetBookById(bookId: number): void {
    this.router.navigate(['books', bookId]);
  }

  onRemoveAllBooksFromCart() {
    const removeAllBooksSubscription = this.cartService
      .deleteAllBooksFromCart()
      .subscribe();

    this.subscriptions.add(removeAllBooksSubscription);
  }
}
