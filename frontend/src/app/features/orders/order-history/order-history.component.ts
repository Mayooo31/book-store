import { Component, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { OrderService } from '../order.service';
import { ActivatedRoute } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { CapitalizePipe } from '../../../core/pipes/capitalize.pipe';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [
    DatePipe,
    CurrencyPipe,
    CapitalizePipe,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css'],
})
export class OrderHistoryComponent implements OnInit {
  private orderService = inject(OrderService);
  private route = inject(ActivatedRoute);
  private orderId = this.route.snapshot.paramMap.get('orderId');
  private destroyRef = inject(DestroyRef);
  order = this.orderService.order;

  loading = signal<boolean>(true);
  error = signal<string>('');

  ngOnInit() {
    this.orderService
      .getHistoryById(+this.orderId!)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        error: (err) => {
          this.loading.set(false);
          this.error.set(err.error.message);
        },
        complete: () => this.loading.set(false),
      });
  }
}
