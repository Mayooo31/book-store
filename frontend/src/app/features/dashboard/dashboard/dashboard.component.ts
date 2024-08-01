import { Component, inject, OnInit, signal } from '@angular/core';
import { OrdersHistoryComponent } from '../../orders/orders-history/orders-history.component';
import { DashboardService } from '../dashboard.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [OrdersHistoryComponent, CurrencyPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  dashboardService = inject(DashboardService);
  statistics = this.dashboardService.statistics;

  loading = signal(true);
  error = signal('');

  ngOnInit(): void {
    this.dashboardService.getStatistics().subscribe({
      error: () => {
        this.error.set('We could not fetch the statistics...');
        this.loading.set(false);
      },
      complete: () => this.loading.set(false),
    });
  }
}
