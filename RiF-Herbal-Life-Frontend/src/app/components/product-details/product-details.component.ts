import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { NotificationService } from '../../services/notification.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {
  product?: Product;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    const productId = +this.route.snapshot.paramMap.get('id')!;
    this.productService.getProductById(productId).subscribe({
      next: (data) => (this.product = data),
      error: (err) => console.error('Error fetching product details', err)
    });
  }

  addToCart() {
    if (this.product && this.product.productId && this.product.stock && this.product.stock > 0) {
      this.cartService.addToCart(this.product.productId).subscribe({
        next: () => {
          this.notificationService.success(`${this.product!.productName} added to cart!`);
        },
        error: (err) => {
          console.error('Error adding to cart', err);
          this.notificationService.error('Failed to add item to cart');
        }
      });
    }
  }
}
