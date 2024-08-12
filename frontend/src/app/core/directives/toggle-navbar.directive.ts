import { Directive, HostListener, ElementRef, Renderer2 } from '@angular/core';
import { HeaderService } from '../services/header.service';

@Directive({
  selector: '[closeNavbar]',
  standalone: true,
})
export class CloseNavbarDirective {
  constructor(
    private headerService: HeaderService,
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  @HostListener('click', ['$event'])
  onClick(event: Event): void {
    event.preventDefault();
    this.headerService.closeNavbar();
  }
}
