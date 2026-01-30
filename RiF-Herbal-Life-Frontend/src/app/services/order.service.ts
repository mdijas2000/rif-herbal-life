import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CartItem } from '../models/cart-item';

import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private baseUrl = `${environment.apiUrl}/orders`;

    constructor(private http: HttpClient) { }

    getAuthHeaders() {
        const token = localStorage.getItem("token");
        return {
            headers: new HttpHeaders({
                Authorization: `Bearer ${token}`
            })
        };
    }

    placeOrder(deliveryAddress: string, deliveryMobileNumber: string): Observable<any> {
        return this.http.post(`${this.baseUrl}`, { deliveryAddress, deliveryMobileNumber }, this.getAuthHeaders());
    }

    cancelOrder(orderId: number): Observable<any> {
        return this.http.post(`${this.baseUrl}/${orderId}/cancel`, {}, this.getAuthHeaders());
    }

    getAllOrders(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}`, this.getAuthHeaders());
    }

    getMyOrders(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/my-orders`, this.getAuthHeaders());
    }

    updateOrderTracking(orderId: number, trackingId: string, status: string): Observable<any> {
        return this.http.post(`${this.baseUrl}/${orderId}/tracking`, { trackingId, status }, this.getAuthHeaders());
    }
}
