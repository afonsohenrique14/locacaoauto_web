import { Routes } from '@angular/router';
import { AppLayout } from './shared/components/layout/app-layout';
import { PublicLayout } from './features/public/public-layout/public-layout';
import { publicGuard } from './core/guards/public-guard';
import { authGuard } from './core/guards/auth-guard';

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
        path: 'complete-profile',
        loadComponent: () =>
          import('./features/auth/complete-profile/complete-profile').then(
            (m) => m.CompleteProfile,
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: ''
  }
];
