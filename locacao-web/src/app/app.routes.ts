import { Routes } from '@angular/router';
import {Layout} from './shared/components/layout/layout';

export const routes: Routes = [

  {
    path: '',
    component: Layout,
    children: [
      {  path: '',
        loadComponent: () => import('./features/public/home/home').then(m => m.Home)
      }
    ]
  }
];
