import { Component } from '@angular/core';
import { DashboardComponent } from '../../../features/dashboard/dashboard/dashboard.component';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [DashboardComponent],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.css',
})
export class DashboardPageComponent {}
