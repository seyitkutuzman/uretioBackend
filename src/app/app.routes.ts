import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { AdminLoginComponent } from './auth/admin-login/admin-login.component';
import { DashboardPlaceholderComponent } from './dashboard-placeholder/dashboard-placeholder.component';
import { ChangePasswordComponent } from './auth/change-password/change-password.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { AuthGuard } from './auth/auth.guard';
import { BasvurularListComponent } from './basvuru/basvurular-list/basvurular-list.component';
import { BasvuruDetailsComponent } from './basvuru/basvuru-details/basvuru-details.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { CompanyLoginComponent } from './auth/company-login/company-login.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'admin-login', component: AdminLoginComponent },
    { path: 'dashboard', component: DashboardPlaceholderComponent, canActivate: [AuthGuard] },
    { path: 'password-change', component: ChangePasswordComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent },
    { path: 'basvurular', component: BasvurularListComponent},
    { path: 'basvurular/:id', component: BasvuruDetailsComponent },
    { path: 'admin-dashboard', component: AdminDashboardComponent },
    {path: 'company-login', component: CompanyLoginComponent}
];
