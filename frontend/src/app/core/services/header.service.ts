import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  private isOpenNavbar_ = signal(false);
  isOpenNavbar = this.isOpenNavbar_.asReadonly();

  closeNavbar() {
    this.isOpenNavbar_.set(false);
  }
  toggleNavbar() {
    this.isOpenNavbar_.update((prev) => !prev);
  }
}
