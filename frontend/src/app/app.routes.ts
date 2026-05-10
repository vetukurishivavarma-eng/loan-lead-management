import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { AddLeadComponent } from './features/dashboard/components/add-lead/add-lead.component';
import { UploadLeadsComponent } from './features/dashboard/components/upload-leads/upload-leads.component';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'leads/add', component: AddLeadComponent, canActivate: [AuthGuard] },
  { path: 'leads/upload', component: UploadLeadsComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
