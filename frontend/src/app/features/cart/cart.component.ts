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
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

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
  private toastr = inject(ToastrService);
  private router = inject(Router);
  cart = this.cartService.cart;
  loading = signal<boolean>(true);
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
        error: (err) => {
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

    const address = this.form.value.address;
    const creditCard = this.form.value['credit-card'];

    if (!address || !creditCard) return;

    const checkoutSubscription = this.cartService
      .checkout(address, creditCard)
      .subscribe({
        next: (response) => {
          this.router.navigate(['order/history', response.orderId]);
          const viewCartSubscription = this.cartService.viewCart().subscribe();
          this.subscriptions.add(viewCartSubscription);
          this.toastr.success(
            'Successfully ordered. We are already working on your order...'
          );
        },
        error: (err) =>
          this.toastr.error('Something happened. Please try again later...'),
      });

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
      .subscribe({
        complete: () =>
          this.toastr.success('Successfully removed all books from cart...'),
      });

    this.subscriptions.add(removeAllBooksSubscription);
  }
}
