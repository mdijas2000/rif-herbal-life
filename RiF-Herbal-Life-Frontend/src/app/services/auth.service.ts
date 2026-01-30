import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = `${environment.apiUrl}/auth`;
  private platformId = inject(PLATFORM_ID);

  constructor(private http: HttpClient) { }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  login(data: { username: string, password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, data).pipe(
      tap((res: any) => {
        if (this.isBrowser()) {
          localStorage.setItem('token', res.token);
          try {
            const decoded: any = this.decodeToken(res.token);
            if (decoded && decoded.exp) {
              localStorage.setItem('token_exp', (decoded.exp * 1000).toString());
            }
          } catch (e) {
          }
          if (res.username) {
            localStorage.setItem('username', res.username);
          }
          if (res.role) {
            localStorage.setItem('role', res.role);
          }
        }
      })
    );
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, user);
  }

  decodeToken(token: string) {
    return JSON.parse(atob(token.split('.')[1]));
  }

  isTokenExpired(): boolean {
    if (!this.isBrowser()) return true;
    const exp = localStorage.getItem('token_exp');
    if (!exp) return true;
    return Date.now() > +exp;
  }

  isLoggedIn(): boolean {
    if (!this.isBrowser()) return false;
    return !!localStorage.getItem('token');
  }

  getUsername() {
    if (!this.isBrowser()) return null;
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const decoded: any = this.decodeToken(token);
      return decoded.username || null;
    } catch {
      return null;
    }
  }

  getToken(): string {
    if (!this.isBrowser()) return '';
    return localStorage.getItem('token') || '';
  }

  logout() {
    if (this.isBrowser()) {
      localStorage.removeItem('token');
      localStorage.removeItem('token_exp');
      localStorage.removeItem('username');
      localStorage.removeItem('role');
    }
  }

  getRole(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem('role');
  }

  isAdmin(): boolean {
    return this.getRole() === 'ROLE_ADMIN';
  }
}
