import { inject, Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { CartService } from './cart.service';
import { ToastrService } from 'ngx-toastr';
import { Cart, LoginResults } from '../../types/types';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private http = inject(HttpClient);
  private cookieService = inject(CookieService);
  private toastr = inject(ToastrService);
  private router = inject(Router);
  private injector = inject(Injector);

  // using injector because two services use each other and that can cause a loop
  private _cartService?: CartService;
  private get cartService(): CartService {
    if (!this._cartService) {
      this._cartService = this.injector.get(CartService);
    }
    return this._cartService;
  }

  login(email: string, password: string): Observable<Cart> {
    return this.http
      .post<LoginResults>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap((results) => {
          this.toastr.success(results.message, `Hello ${results.name}`);
        }),
        switchMap((loggedUser) => {
          this.setSession(loggedUser);
          return this.cartService.viewCart();
        })
      );
  }

  register(
    name: string,
    email: string,
    password: string
  ): Observable<{ message: string }> {
    return this.http
      .post<{ message: string }>(`${this.apiUrl}/register`, {
        name,
        email,
        password,
      })
      .pipe(tap((results) => this.toastr.info(results.message)));
  }

  private setSession(authResult: LoginResults): void {
    const expiresAt = new Date(authResult.expiresAt).getTime();

    this.cookieService.set(
      'token',
      authResult.token,
      expiresAt,
      '/',
      '',
      true,
      'Strict'
    );
    this.cookieService.set(
      'token_expiration',
      expiresAt.toString(),
      new Date(expiresAt),
      '/',
      '',
      true,
      'Strict'
    );
    this.cookieService.set(
      'user_name',
      authResult.name,
      expiresAt,
      '/',
      '',
      true,
      'Strict'
    );
    this.cookieService.set(
      'user_email',
      authResult.email,
      expiresAt,
      '/',
      '',
      true,
      'Strict'
    );
    this.cookieService.set(
      'user_role',
      authResult.role,
      expiresAt,
      '/',
      '',
      true,
      'Strict'
    );
  }

  logout(): void {
    this.cookieService.deleteAll();
    this.cartService.removeCart();
    this.router.navigate(['books']);
  }

  isTokenExpired(): boolean {
    const expiration = this.cookieService.get('token_expiration');
    if (!expiration) {
      return true;
    }
    const expiresAt = parseInt(expiration, 10);
    return new Date().getTime() > expiresAt;
  }

  getToken(): string {
    return this.cookieService.get('token');
  }

  isLoggedIn(): boolean {
    return !!this.cookieService.get('token');
  }

  getUserName(): string | null {
    return this.cookieService.get('user_name');
  }

  getUserEmail(): string | null {
    return this.cookieService.get('user_email');
  }

  getUserRole(): string | null {
    return this.cookieService.get('user_role');
  }

  isAdminManageBooks(): boolean {
    const isAdmin = this.getUserRole() === 'admin';
    const isOnDashboard = this.router.url.includes('dashboard');
    return isAdmin && isOnDashboard;
  }
}
