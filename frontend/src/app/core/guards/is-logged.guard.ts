import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class IsLoggedGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const isLoggedIn = this.authService.isLoggedIn();
    const url = state.url;

    if (isLoggedIn && (url === '/login' || url === '/register')) {
      // If logged in and trying to access /login or /register, redirect to books
      this.router.navigate(['/books']);
      return false;
    } else if (!isLoggedIn && url.startsWith('/order/history')) {
      // If not logged in and trying to access /order/history, redirect to login
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}
