import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartItem } from '../../models/cart-item';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { NgFor, NgIf } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-mini-cart',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf],
  templateUrl: './mini-cart.component.html',
  styleUrl: './mini-cart.component.css'
})
export class MiniCartComponent implements OnInit, OnDestroy {

  cart: CartItem[] = [];
  totalPrice: number = 0;
  isMinimized: boolean = true;
  private cartSubscription: Subscription | undefined;

  toggleCart() {
    this.isMinimized = !this.isMinimized;
  }

  constructor(private cartService: CartService, private router: Router) { }

  ngOnInit() {
    this.cartSubscription = this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
      this.totalPrice = this.cartService.getTotalPrice();
    });
    this.loadCart();
  }

  ngOnDestroy() {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  loadCart() {
    this.cartService.getCart().subscribe();
  }

  remove(productId: number) {
    this.cartService.remove(productId).subscribe();
  }
  increase(productId: number) {
    this.cartService.increase(productId).subscribe();
  }
  decrease(productId: number) {
    this.cartService.decrease(productId).subscribe();
  }
  setLocalCart(cart: CartItem[]) {
    this.cart = cart;
  }

  getLocalCart() {
    return this.cart;
  }

  getTotalPrice() {
    return this.cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

  }

  checkout() {
    this.router.navigate(['/cart']);
  }
}
