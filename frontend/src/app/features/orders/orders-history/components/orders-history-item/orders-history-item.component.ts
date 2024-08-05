import {
  Component,
  inject,
  OnInit,
  OnDestroy,
  signal,
  input,
  DestroyRef,
} from '@angular/core';
import { OrderDetail } from '../../../../../types/types';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { CapitalizePipe } from '../../../../../core/pipes/capitalize.pipe';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DashboardService } from '../../../../dashboard/dashboard.service';
import { Subscription, switchMap } from 'rxjs';

@Component({
  selector: 'tr[app-orders-history-item]',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, CapitalizePipe, ReactiveFormsModule],
  templateUrl: './orders-history-item.component.html',
  styleUrls: ['./orders-history-item.component.css'],
})
export class OrdersHistoryItemComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private destroyRef = inject(DestroyRef);

  order = input<OrderDetail>({} as OrderDetail);
  isOnDashboard = input<boolean>(false);

  statusForm!: FormGroup;
  statusControl!: FormControl;

  ngOnInit(): void {
    this.statusControl = new FormControl(this.order().status);
    this.statusForm = new FormGroup({
      status: this.statusControl,
    });

    const subscription = this.statusForm.valueChanges
      .pipe(
        switchMap((result: { status: string }) =>
          this.dashboardService.changeStatusOfOrder(
            this.order().id,
            result.status
          )
        )
      )
      .subscribe();

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  onPreventDefault(event: Event) {
    event.stopPropagation();
  }
}
