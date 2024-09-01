import { Component, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { OrdersHistoryComponent } from '../../orders/orders-history/orders-history.component';
import { DashboardService } from '../dashboard.service';
import { CurrencyPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { MatCardModule } from '@angular/material/card'; // For using MatCard component
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    OrdersHistoryComponent,
    CurrencyPipe,
    MatCardModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private destroyRef = inject(DestroyRef);
  statistics = this.dashboardService.statistics;

  loading = signal(true);
  error = signal('');

  ngOnInit(): void {
    this.dashboardService
      .getStatistics()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        error: () => {
          this.error.set('We could not fetch the statistics...');
          this.loading.set(false);
        },
        complete: () => this.loading.set(false),
      });
  }
}
