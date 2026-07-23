import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VehicleService } from '../../../../core/services/vehicle-service';
import { VehicleResponse } from '../../../../core/models/vehicle-response.model';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DecimalPipe } from '@angular/common';
import { VEICULO_STATUS, VeiculoStatus } from '../../../../core/models/vehicle.model';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../../../core/services/notification';

@Component({
  selector: 'app-vehicle-details',
  imports: [CardModule, TagModule, ButtonModule, ProgressSpinnerModule, DecimalPipe, SelectModule, InputNumberModule, TooltipModule, FormsModule],
  templateUrl: './vehicle-details.html',
  styleUrl: './vehicle-details.scss',
})
export class VehicleDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private vehicleService = inject(VehicleService);
  private notification = inject(NotificationService);

  vehicle = signal<VehicleResponse | null>(null);
  loading = signal(false);
  editingMileage = signal(false);
  editingStatus = signal(false);
  newMileage = signal<number | null>(null);
  newStatus = signal<VeiculoStatus | null>(null);

  statusOptions = [
    { label: 'Disponível', value: VEICULO_STATUS.Available },
    { label: 'Em Manutenção', value: VEICULO_STATUS.InMaintenance },
  ];

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.carregar(id);
  }

  getSeverity(status: VeiculoStatus) {
    return this.vehicleService.getSeverity(status);
  }

  private carregar(id: string) {
    this.loading.set(true);
    this.vehicleService.getById(id).subscribe({
      next: (data) => {
        this.vehicle.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  onEditMileage() {
    this.newMileage.set(this.vehicle()!.mileage);
    this.editingMileage.set(true);
  }

  onEditStatus() {
    this.newStatus.set(this.vehicle()!.status);
    this.editingStatus.set(true);
  }

  saveMileage() {
    const id = this.vehicle()!.id;
    const mileage = this.newMileage();

    console.log(mileage)
    if (mileage === null) return;

    this.vehicleService.updateVehicle(id, { mileage }).subscribe({
      next: () => {
        this.notification.success('Quilometragem atualizada.');
        this.carregar(id);
        this.editingMileage.set(false);
      },
      error: (err) => this.notification.error(err.error || 'Erro ao atualizar.')
    });
  }

  saveStatus() {
    const id = this.vehicle()!.id;
    const status = this.newStatus();
    if (status === null) return;

    this.vehicleService.updateVehicle(id, { status }).subscribe({
      next: () => {
        this.notification.success('Status atualizado.');
        this.carregar(id);
        this.editingStatus.set(false);
      },
      error: (err) => this.notification.error(err.error || 'Erro ao atualizar.')
    });
  }
}
