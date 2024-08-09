import {
  Component,
  inject,
  Input,
  OnInit,
  OnDestroy,
  signal,
  input,
} from '@angular/core';
import { CartItem } from '../../../../types/types';
import { CurrencyPipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CartService } from '../../../../core/services/cart.service';
import { Subscription, switchMap } from 'rxjs';

@Component({
  selector: 'tr[app-cart-item]',
  standalone: true,
  imports: [CurrencyPipe, ReactiveFormsModule],
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.css'],
})
export class CartItemComponent implements OnInit, OnDestroy {
  private cartService = inject(CartService);
  private subscriptions: Subscription = new Subscription();
  item = input<CartItem>({} as CartItem);

  quantityForm!: FormGroup;
  quantityControl!: FormControl;

  ngOnInit(): void {
    this.quantityControl = new FormControl(this.item().quantity);
    this.quantityForm = new FormGroup({
      quantity: this.quantityControl,
    });

    const quantityChangesSubscription = this.quantityForm.valueChanges
      .pipe(
        switchMap((result: { quantity: number }) =>
          this.cartService.addBook(this.item().book_id, result.quantity, 'set')
        )
      )
      .subscribe();

    this.subscriptions.add(quantityChangesSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onPreventDefault(event: Event) {
    event.stopPropagation();
  }

  onDeleteBook(event: Event): void {
    event.stopPropagation();
    const deleteBookSubscription = this.cartService
      .deleteBook(this.item().book_id)
      .subscribe();

    this.subscriptions.add(deleteBookSubscription);
  }
}
