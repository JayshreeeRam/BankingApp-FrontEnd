import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';   
import { UserDashboardComponent } from './dashboard/user-dashboard/user-dashboard.component';
import { DashboardLayoutComponent } from './layout/dashboard-layout/dashboard-layout.component';
import { AdminDashboardComponent } from './dashboard/admin-dashboard/admin-dashboard.component';
import { SuperadminDashboardComponent } from './dashboard/superadmin-dashboard/superadmin-dashboard.component';
import { Client } from './components/client/client';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard/user', component: UserDashboardComponent },
  { path: 'dashboard/admin', component: AdminDashboardComponent },
  { path: 'dashboard/superadmin', component: SuperadminDashboardComponent },
  { path: 'clients', component: Client },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
  path: 'forgot-password',
  loadComponent: () => import('./forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
}
];

