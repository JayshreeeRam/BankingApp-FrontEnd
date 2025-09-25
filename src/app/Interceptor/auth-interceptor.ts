import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
 
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
 
  let clonedReq = req;
 
  if (token) {
    clonedReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
  } else {
    console.warn('No token found, sending request without Authorization header.');
  }
 
  console.log('Intercepted request:', clonedReq.url);
  console.log('Headers:', clonedReq.headers.keys(), clonedReq.headers.get('Authorization'));
 
  return next(clonedReq);
};