import { Component, inject, signal } from '@angular/core';
import { RentalService } from '../../../core/services/rental-service';
import { Rental } from '../../../core/models/rental.model';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ConfirmDialog } from "primeng/confirmdialog";
import { Tooltip } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-rentals',
  imports: [ButtonModule, CardModule, TableModule, ConfirmDialog, ConfirmDialog, Tooltip, TagModule, DatePipe],
  templateUrl: './rentals.html',
  styleUrl: './rentals.scss',
})
export class Rentals {
[x: string]: any;

  rentals = signal<Rental[]>([])
  loading = signal(false)
  rentalService = inject(RentalService)
  router = inject(Router)

  ngOnInit(){
    this.carregar();
  }

  private carregar(){
    this.loading.set(true);
    this.rentalService.getAll().subscribe({
      next: data => {
        this.rentals.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }

    })
  }

  EndRental(id: string){

  }

}
