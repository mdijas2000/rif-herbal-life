import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.css'
})
export class EditProductComponent implements OnInit {
  product: Product = { productName: '', description: '', price: 0, imageURL: '' };
  productId!: number;
  selectedFile: File | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadProduct(this.productId);
  }

  loadProduct(productId: number) {
    this.productService.getProductById(productId).subscribe({
      next: (data) => (this.product = data),
      error: (err) => console.error('Error fetching product', err)
    });
  }

  onUpdate() {
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
    this.productService.updateProduct(this.productId, this.product).subscribe({
      next: () => {
        this.notificationService.success('Product updated successfully!');
        this.router.navigate(['/admin/dashboard']);
      },
      error: (err) => {
        this.notificationService.error('Failed to update product');
        console.error('Error updating product', err);
      }
    });
  }

  onCancel() {
    this.router.navigate(['/admin/dashboard']);
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
