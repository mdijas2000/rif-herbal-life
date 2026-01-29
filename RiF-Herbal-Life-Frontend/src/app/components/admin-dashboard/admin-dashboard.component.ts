import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { Product } from '../../models/product.model';
import { Order } from '../../models/order.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  products: Product[] = [];
  orders: Order[] = [];
  statusFilter: string = 'ALL'; // Filter for order status
  stats = {
    totalProducts: 0,
    totalOrders: 0,
    lowStockProducts: 0,
    totalRevenue: 0
  };
  activeTab: 'products' | 'orders' | 'stats' = 'stats';

  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    public authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.loadProducts();
    this.loadOrders();
  }

  loadProducts() {
    this.productService.getAllProducts().subscribe(data => {
      this.products = data;
      this.calculateStats();
    });
  }

  loadOrders() {
    this.orderService.getAllOrders().subscribe(data => {
      this.orders = data;
      this.calculateStats();
    });
  }

  calculateStats() {
    this.stats.totalProducts = this.products.length;
    this.stats.totalOrders = this.orders.length;
    this.stats.lowStockProducts = this.products.filter(p => (p.stock || 0) < 20).length;
    this.stats.totalRevenue = this.orders.reduce((sum, order) => sum + order.totalAmount, 0);
  }

  get filteredOrders(): Order[] {
    if (this.statusFilter === 'ALL') {
      return this.orders;
    }
    return this.orders.filter(order => order.status === this.statusFilter);
  }

  async deleteProduct(id: number) {
    const confirmed = await this.notificationService.confirm(
      'Delete Product',
      'Are you sure you want to delete this product? This action cannot be undone.'
    );

    if (confirmed) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.notificationService.success('Product deleted successfully!');
          this.loadProducts();
          this.calculateStats();
        },
        error: (err) => {
          this.notificationService.error('Failed to delete product');
          console.error('Error deleting product', err);
        }
      });
    }
  }

  updateTracking(order: any) {
    this.orderService.updateOrderTracking(order.orderId, order.trackingId, order.status).subscribe({
      next: (res) => {
        this.notificationService.success('Tracking updated successfully!');
      },
      error: (err) => {
        console.error('Error updating tracking', err);
        this.notificationService.error('Failed to update tracking');
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
