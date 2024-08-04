import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { HeaderService } from '../../../core/services/header.service';
import { CloseNavbarDirective } from '../../../core/directives/toggle-navbar.directive';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-general-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CloseNavbarDirective],
  templateUrl: './general-header.component.html',
  styleUrls: ['./general-header.component.css'],
})
export class GeneralHeaderComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private headerService = inject(HeaderService);
  isOpenNavbar = this.headerService.isOpenNavbar;
  totalItemsInCart = this.cartService.totalItemsInCart;
  private subscription: Subscription = new Subscription();

  onToggleNavbar() {
    this.headerService.toggleNavbar();
  }

  ngOnInit(): void {
    if (this.isLoggedIn()) {
      const cartSubscription = this.cartService.viewCart().subscribe();
      this.subscription.add(cartSubscription);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
