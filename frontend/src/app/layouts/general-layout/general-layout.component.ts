import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GeneralHeaderComponent } from '../../shared/components/general-header/general-header.component';
import { MainLayoutComponent } from '../main-layout/main-layout.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-general-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    GeneralHeaderComponent,
    MainLayoutComponent,
    FooterComponent,
  ],
  templateUrl: './general-layout.component.html',
})
export class GeneralLayoutComponent {}
