import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-shared-auth-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form class="form-container" [formGroup]="form" (submit)="onSubmit()">
      <h1>{{ title }}</h1>

      @for(control of formControls; track control){
      <div>
        <label [for]="control">{{ getLabel(control) }}:</label>
        <input
          [id]="control"
          [type]="getType(control)"
          [formControlName]="control"
        />
        @if(getValidity(control)){
        <p class="error">{{ getErrorMessage(control) }}</p>
        }
      </div>
      } @if(error){
      <p class="error">{{ error }}</p>
      }
      <button type="submit" [disabled]="loading">Submit</button>
    </form>
  `,
  styleUrls: ['./shared-auth-form.component.css'],
})
export class SharedAuthFormComponent {
  @Input() form!: FormGroup;
  @Input() title!: string;
  @Input() error!: string;
  @Input() loading!: boolean;
  @Input() formControls!: string[];
  @Output() formSubmit = new EventEmitter<void>();

  getValidity(controlName: string): boolean {
    const control = this.form.get(controlName);
    return control!.touched && control!.dirty && control!.invalid;
  }

  getLabel(controlName: string): string {
    const labels: { [key: string]: string } = {
      email: 'Email',
      password: 'Password',
      name: 'Name',
    };
    return labels[controlName] || controlName;
  }

  getType(controlName: string): string {
    return controlName === 'password' ? 'password' : 'text';
  }

  getErrorMessage(controlName: string): string {
    const errorMessages: { [key: string]: string } = {
      email: 'This email is not valid.',
      password: 'Password should be at least 5 characters long.',
      name: 'Name should be at least 3 characters long.',
    };
    return errorMessages[controlName] || 'This field is not valid.';
  }

  onSubmit() {
    this.formSubmit.emit();
  }
}
