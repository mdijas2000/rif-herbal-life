import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../models/product.model';
import { AuthService } from './auth.service';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private api = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getAuthHeaders(): HttpHeaders {
    // Retrieve token from AuthService
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  private fixUrl(url: string): string {
    if (url && url.includes('localhost:8080')) {
      // Extract the path from localhost URL
      const pathIndex = url.indexOf('/uploads');
      if (pathIndex !== -1) {
        const relativePath = url.substring(pathIndex);
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
    return this.http.post<Product>(this.api, product, { headers: this.getAuthHeaders() }).pipe(
      map(p => {
        if (p.imageURL) {
          p.imageURL = this.fixUrl(p.imageURL);
        }
        return p;
      })
    );
  }

  updateProduct(productId: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.api}/${productId}`, product, { headers: this.getAuthHeaders() }).pipe(
      map(p => {
        if (p.imageURL) {
          p.imageURL = this.fixUrl(p.imageURL);
        }
        return p;
      })
    );
  }

  deleteProduct(productId: number): Observable<any> {
    return this.http.delete(`${this.api}/${productId}`, { headers: this.getAuthHeaders() });
  }

  uploadImage(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ url: string }>(`${environment.apiUrl}/upload`, formData, { headers: this.getAuthHeaders() }).pipe(
      map(res => {
        return { url: this.fixUrl(res.url) };
      })
    );
  }
}
