import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';   
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { DashboardLayoutComponent } from './layout/dashboard-layout/dashboard-layout.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { SuperadminDashboardComponent } from './components/superadmin-dashboard/superadmin-dashboard.component';
import { ClientDetailsComponent } from './components/client/client';
import { AdminGuard } from './guards/adminGuard';
import { UserGuard } from './guards/userGuard';
import { SuperadminGuard } from './guards/superadminGuard';
import { Transactions } from './components/transactions/transactions';
import { PaymentComponent } from './components/payment/payment';
import { CreateBeneficaryComponent } from './components/create-beneficary-component/create-beneficary-component';
import { BeneficaryComponent } from './components/beneficary-component/beneficary-component';

import { Support } from './components/support/support';
import { Documents } from './components/documents/documents';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'clients', component: ClientDetailsComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'forgot-password',
    loadComponent: () => import('./forgot-password/forgot-password.component')
      .then(m => m.ForgotPasswordComponent)
  },

  { path: 'dashboard/admin', component: AdminDashboardComponent, canActivate: [AdminGuard] },
  { path: 'dashboard/user', component: UserDashboardComponent, canActivate: [UserGuard] },
  { path: 'dashboard/superadmin', component: SuperadminDashboardComponent, canActivate: [SuperadminGuard] },

  { path: 'transactions/user/:id', component: Transactions, canActivate: [UserGuard] },
  { path: 'beneficiary', component:BeneficaryComponent },
  { path: 'create-beneficiary/:clientId', component: CreateBeneficaryComponent },
  { path: 'payment', component: PaymentComponent },
  { path: 'support', component: Support },
  { path: 'dashboard/admin/:id', component: Documents }
];
 