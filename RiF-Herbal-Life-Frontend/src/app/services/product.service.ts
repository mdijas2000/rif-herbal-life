import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../models/product.model';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private api = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) { }

  private fixUrl(url: string): string {
    if (url && url.includes('localhost:8080')) {
      // Extract the path from localhost URL
      // e.g., http://localhost:8080/uploads/xyz.png -> /uploads/xyz.png
      // We get the index of /uploads
      const pathIndex = url.indexOf('/uploads');
      if (pathIndex !== -1) {
        const relativePath = url.substring(pathIndex);
        // Replace with environment.apiUrl base
        // environment.apiUrl is .../api, so we need to remove /api for uploads if they are at root
        // But uploads are served from root context, so .../uploads is correct relative to domain root.

        // Render URL: https://rif-herbal-life.onrender.com/api
        // We want: https://rif-herbal-life.onrender.com/uploads/xyz.png

        const baseUrl = environment.apiUrl.replace('/api', '');
        return `${baseUrl}${relativePath}`;
      }
    }
    return url;
  }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.api).pipe(
      map(products => products.map(p => {
        if (p.imageURL) {
          p.imageURL = this.fixUrl(p.imageURL);
        }
        return p;
      }))
    );
  }

  getProductById(productId: number): Observable<Product> {
    return this.http.get<Product>(`${this.api}/${productId}`).pipe(
      map(p => {
        if (p.imageURL) {
          p.imageURL = this.fixUrl(p.imageURL);
        }
        return p;
      })
    );
  }

  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.api, product).pipe(
      map(p => {
        if (p.imageURL) {
          p.imageURL = this.fixUrl(p.imageURL);
        }
        return p;
      })
    );
  }

  updateProduct(productId: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.api}/${productId}`, product).pipe(
      map(p => {
        if (p.imageURL) {
          p.imageURL = this.fixUrl(p.imageURL);
        }
        return p;
      })
    );
  }

  deleteProduct(productId: number): Observable<any> {
    return this.http.delete(`${this.api}/${productId}`);
  }

  uploadImage(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ url: string }>(`${environment.apiUrl}/upload`, formData).pipe(
      map(res => {
        return { url: this.fixUrl(res.url) };
      })
    );
  }
}
