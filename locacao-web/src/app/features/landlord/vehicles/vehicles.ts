import { Component, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { Vehicle, VeiculoStatus } from '../../../core/models/vehicle.model';
import { VehicleService } from '../../../core/services/vehicle-service';
import { CardModule } from 'primeng/card';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vehicles',
  imports: [TableModule, ButtonModule, TagModule, CardModule],
  templateUrl: './vehicles.html',
  styleUrl: './vehicles.scss',
})
export class Vehicles {
  veiculos = signal<Vehicle[]>([])
  loading = signal(false)
  vehicleService = inject(VehicleService)
  router = inject(Router)

  ngOnInit() {
    this.carregar();
  }

  private carregar() {
    this.loading.set(true);
    this.vehicleService.getAll().subscribe(data => {
      this.veiculos.set(data);
      this.loading.set(false);
    });
  }

  getSeverity(status: VeiculoStatus): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    const map: Record<VeiculoStatus, 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast'> = {
      Available: 'success',
      Rented: 'info',
      InMaintenance: 'warn',
    };
    return map[status];
  }
}
