import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { HeaderService } from '../../../core/services/header.service';
import { CloseNavbarDirective } from '../../../core/directives/toggle-navbar.directive';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    CloseNavbarDirective,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatSidenavModule,
  ],
  templateUrl: './admin-header.component.html',
  styleUrl: '../shared-header.component.css',
})
export class AdminHeaderComponent {
  private headerService = inject(HeaderService);
  private cartService = inject(CartService);
  totalItemsInCart = this.cartService.totalItemsInCart;
  isOpenSidebar = this.headerService.isOpenSidebar;

  onToggleNavbar() {
    this.headerService.toggleNavbar();
  }
}
