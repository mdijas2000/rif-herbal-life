import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { HttpClientModule } from '@angular/common/http';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, RouterModule, HttpClientModule],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    featuredProducts: Product[] = [];

    constructor(private productService: ProductService) { }

    ngOnInit(): void {
        this.loadFeaturedProducts();
    }

    loadFeaturedProducts(): void {
        this.productService.getAllProducts().subscribe({
            next: (products) => {
                // Get first 4 products for display
                this.featuredProducts = products.slice(0, 4);
            },
            error: (error) => {
                console.error('Error loading products:', error);
            }
        });
    }
}
