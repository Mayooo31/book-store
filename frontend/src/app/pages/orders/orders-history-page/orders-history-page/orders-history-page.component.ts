import { Component } from '@angular/core';
import { OrdersHistoryComponent } from '../../../../features/orders/orders-history/orders-history.component';

@Component({
  selector: 'app-orders-history-page',
  standalone: true,
  imports: [OrdersHistoryComponent],
  templateUrl: './orders-history-page.component.html',
  styleUrl: './orders-history-page.component.css',
})
export class OrdersHistoryPageComponent {}
