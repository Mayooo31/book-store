import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { HeaderService } from '../../../core/services/header.service';
import { CloseNavbarDirective } from '../../../core/directives/toggle-navbar.directive';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CloseNavbarDirective],
  templateUrl: './admin-header.component.html',
  styleUrl: '../shared-header.component.css',
})
export class AdminHeaderComponent {
  private headerService = inject(HeaderService);
  isOpenNavbar = this.headerService.isOpenNavbar;

  onToggleNavbar() {
    this.headerService.toggleNavbar();
  }
}
