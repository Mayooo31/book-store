import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart-payment-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './cart-payment-form.component.html',
  styleUrl: './cart-payment-form.component.css',
})
export class CartPaymentFormComponent {
  @Output() formSubmit = new EventEmitter<void>();
  @Input() form!: FormGroup;

  getValidity(controlName: string): boolean {
    const control = this.form.get(controlName);
    return control!.touched && control!.dirty && control!.invalid;
  }

  onSubmit() {
    this.formSubmit.emit();
  }
}
