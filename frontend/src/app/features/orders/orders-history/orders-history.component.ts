import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../order.service';
import { Router } from '@angular/router';
import { OrdersHistoryItemComponent } from './components/orders-history-item/orders-history-item.component';
import { DashboardService } from '../../dashboard/dashboard.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-orders-history',
  standalone: true,
  imports: [CommonModule, OrdersHistoryItemComponent],
  templateUrl: './orders-history.component.html',
  styleUrls: ['./orders-history.component.css'],
})
export class OrdersHistoryComponent implements OnInit, OnDestroy {
  private orderService = inject(OrderService);
  private dashboardService = inject(DashboardService);
  private router = inject(Router);
  isOnDashboard = this.router.url.includes('dashboard');
  orders = this.orderService.orders;

  loading = signal(true);
  error = signal('');

  private subscriptions: Subscription = new Subscription();

  ngOnInit() {
    if (this.isOnDashboard) {
      const dashboardOrdersSubscription = this.dashboardService
        .getAllOrders()
        .subscribe({
          error: (err) => {
            this.error.set('Failed to load order history');
            this.loading.set(false);
          },
          next: (results) =>
            this.orderService.setAllOrdersForDashboard(results.results),
          complete: () => this.loading.set(false),
        });

      this.subscriptions.add(dashboardOrdersSubscription);
    } else {
      const historySubscription = this.orderService.getHistory().subscribe({
        error: (err) => {
          this.error.set('Failed to load order history');
          this.loading.set(false);
        },
        complete: () => this.loading.set(false),
      });

      this.subscriptions.add(historySubscription);
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  onGetOrderById(orderId: number): void {
    this.router.navigate(['order/history', orderId]);
  }
}
