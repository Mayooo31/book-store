import { Component, computed, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-shared-auth-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form class="form-container" [formGroup]="form()" (submit)="onSubmit()">
      <h1>{{ title() }}</h1>

      @for(control of formControls(); track control){
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
      } @if(error()){
      <p class="error">{{ error() }}</p>
      }
      <button type="submit" [disabled]="loading()">
        {{ loading() ? loadingMessage() : 'Submit' }}
      </button>
    </form>
  `,
  styleUrls: ['./shared-auth-form.component.css'],
})
export class SharedAuthFormComponent {
  form = input.required<FormGroup>();
  title = input.required<string>();
  error = input.required<string>();
  loading = input.required<boolean>();
  formControls = input.required<string[]>();
  formSubmit = output();

  loadingMessage = computed(() => {
    return this.title() === 'Login' ? 'Logging...' : 'Registering...';
  });

  getValidity(controlName: string): boolean {
    const control = this.form().get(controlName);
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
