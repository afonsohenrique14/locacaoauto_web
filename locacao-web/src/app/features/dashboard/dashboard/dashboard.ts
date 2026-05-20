import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { AuthService } from '../../../core/services/auth';


@Component({
  selector: 'app-dashboard',
  imports: [Button, Card],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {
  private authService = inject(AuthService);
  private router = inject(Router);

  user = this.authService.currentUser;

  selectContext(context: 'landlord' | 'tenant') {
    this.authService.setContext(context);
    this.router.navigate([`/app/${context}`]);
  }

  firstName = computed(() => {
    const user = this.authService.currentUser();
    if (user?.person?.name) {
      return ', ' + user.person.name.split(' ')[0];
    }
    if (user?.email) {
      return ', ' + user.email.split('@')[0];
    }
    return '';
  });

}


