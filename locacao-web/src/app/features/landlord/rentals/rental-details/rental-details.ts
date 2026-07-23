// rental-details.ts
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DividerModule } from 'primeng/divider';
import { RentalService } from '../../../../core/services/rental-service';
import { AuthService } from '../../../../core/services/auth';
import { NotificationService } from '../../../../core/services/notification';
import { Rental_Details } from '../../../../core/models/rental-details.model';
import { RentalStatus } from '../../../../core/models/rental.model';

@Component({
  selector: 'app-rental-details',
  imports: [CardModule, TagModule, ButtonModule, ProgressSpinnerModule, DividerModule, DatePipe, DecimalPipe, CurrencyPipe],
  templateUrl: './rental-details.html',
  styleUrl: './rental-details.scss',
})
export class RentalDetails {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private rentalService = inject(RentalService);
  private notification = inject(NotificationService);

  rental = signal<Rental_Details | null>(null);
  loading = signal(false);

  ngOnInit() {
    const rentalId = this.route.snapshot.paramMap.get('id');
    if (rentalId) this.carregar(rentalId);
  }

  private carregar(rentalId: string) {
    this.loading.set(true);
    this.rentalService.getById(rentalId).subscribe({
      next: (data) => {
        this.rental.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.notification.error('Erro ao carregar locação.');
        this.loading.set(false);
      }
    });
  }

  getSeverity(status: RentalStatus) {
    return this.rentalService.getRentalSeverity(status);
  }

  onBack() {
    this.router.navigate(['/app/landlord/rentals']);
  }
}
