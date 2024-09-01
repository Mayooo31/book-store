import { Component, computed, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-shared-auth-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <form class="form-container" [formGroup]="form()" (submit)="onSubmit()">
      <h1>{{ title() }}</h1>

      @for(control of formControls(); track control) {
      <mat-form-field appearance="fill" class="full-width">
        <mat-label>{{ getLabel(control) }}</mat-label>
        <input
          matInput
          [id]="control"
          [type]="getType(control)"
          [formControlName]="control"
        />
        @if(getValidity(control)) {
        <mat-error>{{ getErrorMessage(control) }}</mat-error>
        }
      </mat-form-field>
      }

      <button
        mat-flat-button
        color="primary"
        type="submit"
        [disabled]="loading()"
        class="loading-button"
      >
        @if(!loading()) { Submit } @else {
        <mat-progress-spinner
          [diameter]="24"
          mode="indeterminate"
          color="accent"
        ></mat-progress-spinner>
        }
      </button>
      @if(error()) {
      <mat-error class="error">{{ error() }}</mat-error>
      }
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
