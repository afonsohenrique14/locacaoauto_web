import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';

@Component({
  selector: 'app-tenant-dashboard',
  imports: [Button, Card],
  templateUrl: './tenant-dashboard.html',
  styleUrl: './tenant-dashboard.scss'
})
export class TenantDashboard {
  private router = inject(Router);

  navigateTo(section: 'rentals') {
    this.router.navigate([`/app/tenant/${section}`]);
  }
}
