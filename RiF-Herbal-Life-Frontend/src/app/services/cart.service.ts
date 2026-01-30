import { Injectable } from '@angular/core';
import { CartItem } from '../models/cart-item';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private baseUrl = `${environment.apiUrl}/cart`;
  private cart: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  cart$ = this.cartSubject.asObservable();

  constructor(private http: HttpClient) { }

  getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }
  addToCart(productId: number): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/add`,
      { productId: productId },
      this.getAuthHeaders()
    ).pipe(
      tap(() => this.getCart().subscribe())
    );
  }


  getCart(): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(`${this.baseUrl}`, this.getAuthHeaders()).pipe(
      tap(cart => {
        this.cart = cart;
        this.cartSubject.next(cart);
      })
    );
  }

  increase(productId: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/increase/${productId}`, {}, this.getAuthHeaders()).pipe(
      tap(() => this.getCart().subscribe())
    );
  }

  decrease(productId: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/decrease/${productId}`, {}, this.getAuthHeaders()).pipe(
      tap(() => this.getCart().subscribe())
    );
  }

  remove(productId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${productId}`, this.getAuthHeaders()).pipe(
      tap(() => this.getCart().subscribe())
    );
  }

  clear(): Observable<any> {
    return this.http.delete(`${this.baseUrl}/clear`, this.getAuthHeaders()).pipe(
      tap(() => this.getCart().subscribe())
    );
  }
  setLocalCart(cart: CartItem[]) {
    this.cart = cart;
    this.cartSubject.next(cart);
  }
  getLocalCart() {
    return this.cart;
  }
  getTotalPrice() {
    return this.cart.reduce(
      (acc, item) => acc + (item.price * item.quantity),
      0
    );
  }
  removeFromCart(productId: number) {
    this.cart = this.cart.filter(item => item.productId !== productId);
    this.cartSubject.next(this.cart);
  }

}

// getCart(): Observable <CartItem[]> {
//   return this.http.get<CartItem[]>(`${this.baseUrl}`,this.getAuthHeaders());
// }

// getTotalPrice(){
//   return this.cart.reduce((acc,item)=> acc + (item.price * item.quantity),0);
// }

// removeFromCart(productId: number){
//   this.cart = this.cart.filter(item => item.productId !== productId);
// }

// clearCart(){
//   this.cart = [];
// }

// increase(productId: number){
//   const item = this.cart.find(ci => ci.productId === productId);
//   if(item){
//     item.quantity++;
//   }
// }

// decrease(productId:number){
//   const item =this.cart.find(ci => ci.productId === productId);
//   if(item){
//     if(item.quantity >1){
//       item.quantity--;
//     } else{
//       this.removeFromCart(productId);
//     }
//   }
// }


