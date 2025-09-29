import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const role = this.authService.getRole();
     console.log('Role in guard:', role);
       console.log('[UserGuard] Role:', role);
    if (role?.toLocaleLowerCase() === 'user' || role?.toLocaleLowerCase() === 'client') {
      return true;
    }

    this.router.navigate(['/unauthorized']);
    return false;
  }
}
