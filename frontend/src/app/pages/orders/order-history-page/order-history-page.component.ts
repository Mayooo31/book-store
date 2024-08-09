import { Component } from '@angular/core';
import { OrderHistoryComponent } from '../../../features/orders/order-history/order-history.component';

@Component({
  selector: 'app-order-history-page',
  standalone: true,
  imports: [OrderHistoryComponent],
  templateUrl: './order-history-page.component.html',
  styleUrl: './order-history-page.component.css'
})
export class OrderHistoryPageComponent {

}
