import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { CartItem } from '../../models/cart-item';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
    selector: 'app-cart',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
    cart: CartItem[] = [];
    totalPrice: number = 0;
    showCheckout: boolean = false;
    useProfileAddress: boolean = true;
    deliveryAddress: string = '';
    deliveryMobileNumber: string = '';
    profileAddress: string = '';
    profileMobile: string = '';

    constructor(
        private cartService: CartService,
        private orderService: OrderService,
        private authService: AuthService,
        private router: Router,
        private notificationService: NotificationService
    ) { }

    ngOnInit(): void {
        this.loadCart();
        this.loadUserProfile();
    }

    loadUserProfile() {
        const username = this.authService.getUsername();
        if (username) {
            // Get user profile from local storage or auth service
            const address = localStorage.getItem('userAddress') || '';
            const mobile = localStorage.getItem('userMobile') || '';
            this.profileAddress = address;
            this.profileMobile = mobile;
            this.deliveryAddress = address;
            this.deliveryMobileNumber = mobile;
        }
    }

    loadCart() {
        this.cartService.getCart().subscribe({
            next: (data) => {
                this.cartService.setLocalCart(data);
                this.cart = this.cartService.getLocalCart();
                this.calculateTotal();
            },
            error: (err) => {
                console.error('Error loading cart', err);
            }
        });
    }

    calculateTotal() {
        this.totalPrice = this.cartService.getTotalPrice();
    }

    increase(productId: number) {
        this.cartService.increase(productId).subscribe(() => {
            this.loadCart();
        });
    }

    decrease(productId: number) {
        this.cartService.decrease(productId).subscribe(() => {
            this.loadCart();
        });
    }

    remove(productId: number) {
        this.cartService.remove(productId).subscribe(() => {
            this.cartService.removeFromCart(productId);
            this.cart = this.cartService.getLocalCart();
            this.calculateTotal();
        });
    }

    checkout() {
        if (!this.authService.isLoggedIn()) {
            this.router.navigate(['/login']);
            return;
        }
        // Show checkout form
        this.showCheckoutForm();
    }

    showCheckoutForm() {
        this.showCheckout = true;
    }

    hideCheckoutForm() {
        this.showCheckout = false;
    }

    placeOrder() {
        // Determine which address to use
        const finalAddress = this.useProfileAddress ? this.profileAddress : this.deliveryAddress;
        const finalMobile = this.useProfileAddress ? this.profileMobile : this.deliveryMobileNumber;

        // Validate
        if (!finalAddress || finalAddress.trim() === '') {
            this.notificationService.error('Please enter a delivery address');
            return;
        }
        if (!finalMobile || finalMobile.trim() === '') {
            this.notificationService.error('Please enter a mobile number');
            return;
        }

        this.orderService.placeOrder(finalAddress, finalMobile).subscribe({
            next: (res) => {
                this.notificationService.success('Order placed successfully!');
                this.cartService.clear().subscribe(() => {
                    this.cart = [];
                    this.totalPrice = 0;
                    this.showCheckout = false;
                    this.router.navigate(['/my-orders']);
                });
            },
            error: (err) => {
                console.error('Error placing order', err);
                this.notificationService.error(`Failed to place order: ${err.error || err.message}`);
            }
        });
    }
}
