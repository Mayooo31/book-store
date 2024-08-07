import { Component, DestroyRef, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { SharedAuthFormComponent } from '../shared-auth-form.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, SharedAuthFormComponent],
  templateUrl: './login.component.html',
  styleUrls: ['../shared-auth-form.component.css'],
})
export class LoginComponent {
  private toastr = inject(ToastrService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  loading = signal(false);
  error = signal('');

  form = new FormGroup({
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

    const { email, password } = this.form.value;

    if (email && password) {
      const subscription = this.authService.login(email, password).subscribe({
        error: (error) => {
          this.loading.set(false);
          this.error.set(error.error.message);
        },
        complete: () => {
          this.loading.set(false);
          this.router.navigate(['books']);
        },
      });

      this.destroyRef.onDestroy(() => subscription.unsubscribe());
    }
  }
}
