import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { OrdersHistoryComponent } from '../../orders/orders-history/orders-history.component';
import { DashboardService } from '../dashboard.service';
import { CurrencyPipe } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [OrdersHistoryComponent, CurrencyPipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  dashboardService = inject(DashboardService);
  statistics = this.dashboardService.statistics;

  loading = signal(true);
  error = signal('');

  private statsSubscription?: Subscription;

  ngOnInit(): void {
    this.statsSubscription = this.dashboardService.getStatistics().subscribe({
      error: () => {
        this.error.set('We could not fetch the statistics...');
        this.loading.set(false);
      },
      complete: () => this.loading.set(false),
    });
  }

  ngOnDestroy(): void {
    if (this.statsSubscription) {
      this.statsSubscription.unsubscribe();
    }
  }
}
