import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { LandingComponent } from './features/home/landing/landing.component';
import { RequestFormComponent } from './features/maintenance/request-form/request-form.component';
import { RequestHistoryComponent } from './features/maintenance/request-history/request-history.component';
import { DashboardComponent as TechnicianDashboardComponent } from './features/technician/dashboard/dashboard.component';
import { DashboardComponent as AdminDashboardComponent } from './features/admin/dashboard/dashboard.component';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'maintenance/new',
    component: RequestFormComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['resident'] }
  },
  {
    path: 'maintenance/history',
    component: RequestHistoryComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['resident'] }
  },
  {
    path: 'technician/dashboard',
    component: TechnicianDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['technician'] }
  },
  {
    path: 'admin/dashboard',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin'] }
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
