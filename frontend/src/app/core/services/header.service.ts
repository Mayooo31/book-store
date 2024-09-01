import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  private isOpenSidebar_ = signal(false);
  isOpenSidebar = this.isOpenSidebar_.asReadonly();

  closeNavbar() {
    this.isOpenSidebar_.set(false);
  }
  toggleNavbar() {
    this.isOpenSidebar_.update((prev) => !prev);
  }
}
