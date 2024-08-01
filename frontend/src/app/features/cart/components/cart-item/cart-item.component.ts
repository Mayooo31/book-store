import { Component, inject, input, OnInit } from '@angular/core';
import { CartItem } from '../../../../types/types';
import { CurrencyPipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CartService } from '../../../../core/services/cart.service';

@Component({
  selector: 'tr[app-cart-item]',
  standalone: true,
  imports: [CurrencyPipe, ReactiveFormsModule],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.css',
})
export class CartItemComponent implements OnInit {
  private cartService = inject(CartService);
  item = input<CartItem>({} as CartItem);

  quantityForm!: FormGroup;
  quantityControl!: FormControl;

  ngOnInit(): void {
    this.quantityControl = new FormControl(this.item().quantity);
    this.quantityForm = new FormGroup({
      quantity: this.quantityControl,
    });

    this.quantityForm.valueChanges.subscribe({
      next: (result: { quantity: number }) => {
        this.cartService
          .addBook(this.item().book_id, result.quantity, 'set')
          .subscribe();
      },
    });
  }

  onPreventDefault(event: Event) {
    event.stopPropagation();
  }

  onDeleteBook(event: Event): void {
    event.stopPropagation();
    this.cartService.deleteBook(this.item().book_id).subscribe({
      error: (err) => console.log(err),
    });
  }
}
