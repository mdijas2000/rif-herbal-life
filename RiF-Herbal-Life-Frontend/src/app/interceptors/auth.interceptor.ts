import { HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router =inject(Router);
  const token = localStorage.getItem('token');
  
  
  if(token){
    req=req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        console.warn("Token expired or invalid. Logging out...");
        localStorage.removeItem('token');
        router.navigate(['/login']);
        return throwError(()=> error);
      }
      return throwError(()=> error);
    })
  );
};
