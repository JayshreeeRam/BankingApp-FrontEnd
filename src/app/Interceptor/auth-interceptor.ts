import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  // Skip adding token for auth endpoints and possibly other public endpoints
  const publicEndpoints = [
    '/api/Auth/login',
    '/api/Auth/register',
    '/api/Bank' // Add other public endpoints if needed
  ];

  const isPublicEndpoint = publicEndpoints.some(endpoint => req.url.includes(endpoint));
  
  if (isPublicEndpoint) {
    console.log('🔓 Skipping auth token for public endpoint:', req.url);
    return next(req);
  }

  // Get token from localStorage
  const token = localStorage.getItem('token');

  let clonedReq = req;

  if (token) {
    clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('✅ Token found, adding Authorization header to:', req.url);
  } else {
    console.warn('⚠️ No token found for protected endpoint:', req.url);
    
    // You might want to redirect to login if no token for protected routes
    if (!req.url.includes('/api/Auth/')) {
      console.error('❌ No authentication token available for protected endpoint');
      // router.navigate(['/login']);
    }
  }

  // Add error handling for 401 responses
  return next(clonedReq).pipe(
    catchError((error) => {
      if (error.status === 401) {
        console.error('🚫 401 Unauthorized - Token may be invalid or expired');
        
        // Clear localStorage and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        
        router.navigate(['/login'], {
          queryParams: { message: 'Session expired. Please login again.' }
        });
      }
      return throwError(() => error);
    })
  );
};