import { Component, inject, OnInit, DestroyRef } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { HeaderService } from '../../../core/services/header.service';
import { CloseNavbarDirective } from '../../../core/directives/toggle-navbar.directive';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-general-header',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    CloseNavbarDirective,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatSidenavModule,
  ],
  templateUrl: './general-header.component.html',
  styleUrls: ['../shared-header.component.css'],
})
export class GeneralHeaderComponent implements OnInit {
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private headerService = inject(HeaderService);
  private destroyRef = inject(DestroyRef);
  isOpenSidebar = this.headerService.isOpenSidebar;
  totalItemsInCart = this.cartService.totalItemsInCart;

  onToggleNavbar() {
    this.headerService.toggleNavbar();
  }

  ngOnInit(): void {
    if (this.isLoggedIn()) {
      this.cartService
        .viewCart()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe();
    }
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  isAdmin(): boolean {
    return this.authService.getUserRole() === 'admin';
  }

  onLogout(): void {
    this.authService.logout();
  }
}
