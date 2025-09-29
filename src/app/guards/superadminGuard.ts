import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class SuperadminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const role = this.authService.getRole();
  console.log('SuperadminGuard role:', role);
    if (role?.toLocaleLowerCase() === 'superadmin') {
      return true;
    }

    this.router.navigate(['/unauthorized']);
    return false;
  }
}
