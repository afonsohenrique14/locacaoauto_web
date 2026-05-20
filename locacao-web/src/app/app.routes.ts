import { Routes } from '@angular/router';
import { AppLayout } from './shared/components/layout/app-layout';
import { PublicLayout } from './features/public/public-layout/public-layout';
import { publicGuard } from './core/guards/public-guard';
import { authGuard } from './core/guards/auth-guard';
import { contextGuard } from './core/guards/context-guard-guard';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayout,
    children: [
      {
        path: '',
        loadComponent: () => import('./features/public/home/home').then((m) => m.Home),
      },
      {
        path: 'auth/register',
        canActivate: [publicGuard],
        loadComponent: () => import('./features/auth/register/register').then((m) => m.Register),
      },
      {
        path: 'auth/login',
        canActivate: [publicGuard],
        loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
      },
    ],
  },
  {
    path: 'app',
    component: AppLayout,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        canActivate: [contextGuard],
        loadComponent: () => import('./features/dashboard/dashboard/dashboard').then(m => m.Dashboard)
      },
      {
        path: 'dashboard',
        canActivate: [contextGuard],
        loadComponent: () => import('./features/dashboard/dashboard/dashboard').then(m => m.Dashboard)
      },
      {
        path: 'complete-profile',
        loadComponent: () =>
          import('./features/auth/complete-profile/complete-profile').then(
            (m) => m.CompleteProfile,
          ),
      },
      {
      path: 'landlord',
      redirectTo: 'landlord/dashboard',
      pathMatch: 'full'
    },
    {
      path: 'landlord/dashboard',
      loadComponent: () => import('./features/landlord/landlord-dashboard/landlord-dashboard').then(m => m.LandlordDashboard)
    },
    {
      path: 'landlord/vehicles',
      loadComponent: () => import('./features/landlord/vehicles/vehicles').then(m => m.Vehicles)
    },
    {
      path: 'landlord/rentals',
      loadComponent: () => import('./features/landlord/rentals/rentals').then(m => m.Rentals)
    },
    {
      path: 'tenant',
      redirectTo: 'tenant/rentals',
      pathMatch: 'full'
    },
    {
      path: 'tenant/rentals',
      loadComponent: () => import('./features/tenant/rentals/rentals').then(m => m.TenantRentals)
    },
    ],
  },
  {
    path: '**',
    redirectTo: ''
  }
];
