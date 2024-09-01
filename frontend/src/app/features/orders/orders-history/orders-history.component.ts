import { Component, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../order.service';
import { Router } from '@angular/router';
import { DashboardService } from '../../dashboard/dashboard.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CapitalizePipe } from '../../../core/pipes/capitalize.pipe';

import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-orders-history',
  standalone: true,
  imports: [
    CommonModule,
    CapitalizePipe,
    MatCardModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
  ],
  templateUrl: './orders-history.component.html',
  styleUrls: ['./orders-history.component.css'],
})
export class OrdersHistoryComponent implements OnInit {
  private orderService = inject(OrderService);
  private dashboardService = inject(DashboardService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  isOnDashboard = this.router.url.includes('dashboard');
  orders = this.orderService.orders;

  loading = signal(true);
  error = signal('');

  ngOnInit() {
    if (this.isOnDashboard) {
      this.dashboardService
        .getAllOrders()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          error: (err) => {
            this.error.set('Failed to load order history');
            this.loading.set(false);
          },
          next: (results) =>
            this.orderService.setAllOrdersForDashboard(results.results),
          complete: () => this.loading.set(false),
        });
    } else {
      this.orderService
        .getHistory()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          error: (err) => {
            this.error.set('Failed to load order history');
            this.loading.set(false);
          },
          complete: () => this.loading.set(false),
        });
    }
  }

  onStatusChange(id: number, status: string) {
    this.dashboardService
      .changeStatusOfOrder(id, status)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  onGetOrderById(orderId: number): void {
    this.router.navigate(['order/history', orderId]);
  }
}
