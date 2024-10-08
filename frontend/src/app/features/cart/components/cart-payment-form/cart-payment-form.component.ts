import { Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-cart-payment-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './cart-payment-form.component.html',
  styleUrl: './cart-payment-form.component.css',
})
export class CartPaymentFormComponent {
  checkoutLoading = input();
  form = input.required<FormGroup>();
  formSubmit = output();

  getValidity(controlName: string): boolean {
    const control = this.form().get(controlName);
    return control!.touched && control!.dirty && control!.invalid;
  }

  onSubmit() {
    this.formSubmit.emit();
  }
}
