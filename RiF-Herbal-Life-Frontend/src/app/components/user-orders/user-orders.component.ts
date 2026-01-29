import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';
import { RouterLink } from '@angular/router';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-user-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user-orders.component.html',
  styleUrls: ['./user-orders.component.css']
})
export class UserOrdersComponent implements OnInit {
  orders: Order[] = [];
  loading: boolean = true;

  constructor(
    private orderService: OrderService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getMyOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching orders', err);
        this.loading = false;
      }
    });
  }

  canCancelOrder(order: Order): boolean {
    return order.status === 'PENDING';
  }

  cancelOrder(orderId: number) {
    this.notificationService.confirm(
      'Cancel Order',
      'Are you sure you want to cancel this order? This action cannot be undone.'
    ).then((confirmed: boolean) => {
      if (confirmed) {
        this.orderService.cancelOrder(orderId).subscribe({
          next: () => {
            this.notificationService.success('Order cancelled successfully');
            this.loadOrders(); // Reload orders to show updated status
          },
          error: (err) => {
            console.error('Error cancelling order', err);
            this.notificationService.error(`Failed to cancel order: ${err.error || err.message}`);
          }
        });
      }
    });
  }
}
