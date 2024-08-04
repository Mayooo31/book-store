import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { OrderService } from '../order.service';
import { ActivatedRoute } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { CapitalizePipe } from '../../../core/pipes/capitalize.pipe';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [DatePipe, CurrencyPipe, CapitalizePipe],
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css'],
})
export class OrderHistoryComponent implements OnInit, OnDestroy {
  private orderService = inject(OrderService);
  private route = inject(ActivatedRoute);
  private orderId = this.route.snapshot.paramMap.get('orderId');
  order = this.orderService.order;

  loading = signal<boolean>(true);
  error = signal<string>('');

  private subscription: Subscription = new Subscription();

  ngOnInit() {
    const orderHistorySubscription = this.orderService
      .getHistoryById(+this.orderId!)
      .subscribe({
        error: (err) => {
          this.loading.set(false);
          this.error.set(err.error.message);
        },
        complete: () => this.loading.set(false),
      });

    this.subscription.add(orderHistorySubscription);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
