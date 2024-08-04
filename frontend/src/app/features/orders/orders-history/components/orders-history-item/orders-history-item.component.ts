import {
  Component,
  inject,
  OnInit,
  OnDestroy,
  signal,
  input,
} from '@angular/core';
import { OrderDetail } from '../../../../../types/types';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { CapitalizePipe } from '../../../../../core/pipes/capitalize.pipe';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DashboardService } from '../../../../dashboard/dashboard.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'tr[app-orders-history-item]',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, CapitalizePipe, ReactiveFormsModule],
  templateUrl: './orders-history-item.component.html',
  styleUrls: ['./orders-history-item.component.css'],
})
export class OrdersHistoryItemComponent implements OnInit, OnDestroy {
  private dashboardService = inject(DashboardService);
  private subscriptions: Subscription = new Subscription();

  order = input<OrderDetail>({} as OrderDetail);
  isOnDashboard = input<boolean>(false);

  statusForm!: FormGroup;
  statusControl!: FormControl;

  ngOnInit(): void {
    this.statusControl = new FormControl(this.order().status);
    this.statusForm = new FormGroup({
      status: this.statusControl,
    });

    const statusChangesSubscription = this.statusForm.valueChanges.subscribe({
      next: (result: { status: string }) => {
        const changeStatusSubscription = this.dashboardService
          .changeStatusOfOrder(this.order().id, result.status)
          .subscribe();
        this.subscriptions.add(changeStatusSubscription);
      },
    });

    this.subscriptions.add(statusChangesSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onPreventDefault(event: Event) {
    event.stopPropagation();
  }
}
