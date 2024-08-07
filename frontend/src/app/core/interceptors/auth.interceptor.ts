import { inject } from '@angular/core';
import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);
  const toastr = inject(ToastrService);

  if (authService.isLoggedIn() && authService.isTokenExpired()) {
    authService.logout();
    toastr.warning('Your session has expired. Please log in again.');
    return of();
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${authService.getToken()}`,
    },
  });

  return next(authReq);
};
