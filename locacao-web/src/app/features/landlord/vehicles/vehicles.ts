import { Component, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { VeiculoStatus } from '../../../core/models/vehicle.model';
import { VehicleService } from '../../../core/services/vehicle-service';
import { CardModule } from 'primeng/card';
import { Router } from '@angular/router';
import { VehicleResponse } from '../../../core/models/vehicle-response.model';
import { NotificationService } from '../../../core/services/notification';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Tooltip } from "primeng/tooltip";


@Component({
  selector: 'app-vehicles',
  imports: [TableModule, ButtonModule, TagModule, CardModule, ConfirmDialog, Tooltip],
  templateUrl: './vehicles.html',
  styleUrl: './vehicles.scss',
})
export class Vehicles {
  // vehicles.ts
  veiculos = signal<VehicleResponse[]>([])
  loading = signal(false)
  vehicleService = inject(VehicleService)
  router = inject(Router)
  private notification = inject(NotificationService);
  private confirmationService = inject(ConfirmationService);


  ngOnInit() {
    this.carregar();
  }

  private carregar() {
    this.loading.set(true);
    this.vehicleService.getAll().subscribe({
      next: data => {
        this.veiculos.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }



  deleteVehicle(id: string) {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir este veículo?',
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, excluir',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.vehicleService.deleteVehichle(id).subscribe({
          next: () => {
            this.notification.success('Veículo excluído com sucesso.');
            this.carregar();
          },
          error: (err) => this.notification.error(err.error || 'Erro ao excluir veículo.')
        });
      }
    });
  }
}
