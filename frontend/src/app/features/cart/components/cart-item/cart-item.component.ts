import { Component, inject, OnInit, input, DestroyRef } from '@angular/core';
import { CartItem } from '../../../../types/types';
import { CurrencyPipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CartService } from '../../../../core/services/cart.service';
import { switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'tr[app-cart-item]',
  standalone: true,
  imports: [CurrencyPipe, ReactiveFormsModule],
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.css'],
})
export class CartItemComponent implements OnInit {
  private cartService = inject(CartService);
  private destroyRef = inject(DestroyRef);
  item = input<CartItem>({} as CartItem);

  quantityForm!: FormGroup;
  quantityControl!: FormControl;

  ngOnInit(): void {
    this.quantityControl = new FormControl(this.item().quantity);
    this.quantityForm = new FormGroup({
      quantity: this.quantityControl,
    });

    this.quantityForm.valueChanges
      .pipe(
        switchMap((result: { quantity: number }) =>
          this.cartService.addBook(this.item().book_id, result.quantity, 'set')
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  onPreventDefault(event: Event) {
    event.stopPropagation();
  }

  onDeleteBook(event: Event): void {
    event.stopPropagation();
    this.cartService
      .deleteBook(this.item().book_id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
