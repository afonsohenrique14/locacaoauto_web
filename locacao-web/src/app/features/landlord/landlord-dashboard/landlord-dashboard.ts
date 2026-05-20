import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';

@Component({
  selector: 'app-landlord-dashboard',
  imports: [
    Card,
    Button
  ],
  templateUrl: './landlord-dashboard.html',
  styleUrl: './landlord-dashboard.scss',
})
export class LandlordDashboard {
  private router = inject(Router)

  navigateTo(section: 'vehicles' | 'rentals'){
    this.router.navigate([`app/landlord/${section}`]);
  }

}
