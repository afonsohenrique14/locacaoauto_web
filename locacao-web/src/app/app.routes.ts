import { Routes } from '@angular/router';
import { AppLayout } from './shared/components/layout/app-layout';
import { PublicLayout } from './features/public/public-layout/public-layout';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayout,
    children: [
      { path: '', loadComponent: () => import('./features/public/home/home').then((m) => m.Home) },
    ],
  },
  {
    path: 'app',
    component: AppLayout,
    children: [
      // { path: '', loadComponent: () => import('./features/public/home/home').then((m) => m.Home) },
    ],
  },
];
