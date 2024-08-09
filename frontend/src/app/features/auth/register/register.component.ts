import { Component, DestroyRef, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

import { CommonModule } from '@angular/common';
import { SharedAuthFormComponent } from '../shared-auth-form.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, SharedAuthFormComponent, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['../shared-auth-form.component.css'],
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  loading = signal(false);
  error = signal('');

  form = new FormGroup({
    name: new FormControl('', {
      validators: [Validators.required, Validators.minLength(3)],
    }),
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      validators: [Validators.required, Validators.minLength(5)],
    }),
  });

  onSubmit() {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set('');

    const { name, email, password } = this.form.value;

    if (name && email && password) {
      const subscription = this.authService
        .register(name, email, password)
        .subscribe({
          error: (error) => {
            this.loading.set(false);
            this.error.set(error.error.message);
          },
          complete: () => {
            this.loading.set(false);
            this.router.navigate(['/login']);
          },
        });

      this.destroyRef.onDestroy(() => subscription.unsubscribe());
    }
  }
}
