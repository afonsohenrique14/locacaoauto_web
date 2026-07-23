import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth';
import { environment } from '../../../environments/environment';
import { Rental, RentalStatus } from '../models/rental.model';
import { Rental_Details } from '../models/rental-details.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RentalService {

  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private readonly apiUrl = environment.apiUrl;

  private get personId(): string | undefined {
    return this.authService.currentUser()?.personId ?? undefined;
  }

  getAll(): Observable<Rental[]> {
    if (!this.personId) return of([]);
    return this.http.get<Rental[]>(`${this.apiUrl}/landlords/${this.personId}/rentals`);
  }

  getById(rentalId: string): Observable<Rental_Details> {
    return this.http.get<Rental_Details>(`${this.apiUrl}/landlords/${this.personId}/rentals/${rentalId}`);
  }

  create(data: {
    tenantId: string;
    vehicleId: string;
    startDate: string | null;
    endDate: string | null;
    period: string;
    value: number;
    deposit: number;
  }): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/landlords/${this.personId}/rentals`, data);
  }

  getRentalSeverity(status: RentalStatus): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    const map: Record<RentalStatus, 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast'> = {
      Scheduled: 'info',
      Active: 'success',
      Expired: 'danger',
      Cancelled: 'danger',
      Renewed: 'secondary',
      Closed: 'secondary'
    };
    return map[status];
  }
}
