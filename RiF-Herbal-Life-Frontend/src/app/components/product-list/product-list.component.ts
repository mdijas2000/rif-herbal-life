import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, NgxPaginationModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchText: string = "";
  page: number = 1;
  itemsPerPage: number = 6;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getAllProducts().subscribe((data) => {
      this.products = data;
      this.filteredProducts = data;
    });
  }

  async onDelete(id: number) {
    const confirmed = await this.notificationService.confirm(
      'Delete Product',
      'Are you sure you want to delete this product?'
    );

    if (confirmed) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.notificationService.success('Product deleted successfully!');
          this.loadProducts();
        },
        error: (err) => {
          this.notificationService.error('Failed to delete product');
          console.error('Error deleting product', err);
        }
      });
    }
  }

  addToCart(product: any) {
    if ((product.stock || 0) === 0) {
      this.notificationService.warning('This product is out of stock!');
      return;
    }

    this.cartService.addToCart(product.productId).subscribe({
      next: (res) => {
        this.notificationService.success('Product added to cart successfully!');
        console.log("Added to cart");
      },
      error: (err) => {
        console.log("Error:", err);
        this.notificationService.error('Failed to add product to cart');
      }
    });
  }

  searchProducts() {
    this.filteredProducts = this.products.filter(p =>
      p.productName.toLowerCase().includes(this.searchText.toLowerCase())
    );
    this.page = 1; // Reset to first page when searching
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }
}
