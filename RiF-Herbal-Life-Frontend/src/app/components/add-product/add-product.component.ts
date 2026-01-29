import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent {
  product: Product = { productName: '', description: '', price: 0, imageURL: '', stock: 0 };
  selectedFile: File | null = null;

  constructor(
    private productService: ProductService,
    private router: Router,
    private notificationService: NotificationService
  ) { }

  onSubmit() {
    if (this.selectedFile) {
      this.productService.uploadImage(this.selectedFile).subscribe({
        next: (response) => {
          this.product.imageURL = response.url;
          this.saveProduct();
        },
        error: (err) => {
          this.notificationService.error('Failed to upload image');
          console.error('Error uploading image', err);
        }
      });
    } else {
      this.saveProduct();
    }
  }

  saveProduct() {
    console.log('Submitting product:', this.product);
    this.productService.addProduct(this.product).subscribe({
      next: (res) => {
        this.notificationService.success('Product added successfully!');
        this.router.navigate(['/products']);
      },
      error: (err) => {
        this.notificationService.error('Failed to add product');
        console.error('Error adding product', err);
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      this.selectedFile = file;
      // Preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.product.imageURL = e.target.result; // Temporary preview
      };
      reader.readAsDataURL(file);
    } else {
      this.notificationService.error('Please select a valid image file');
    }
  }
}
