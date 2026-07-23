import { Component, inject, signal } from '@angular/core';
import { Card } from "primeng/card";
import { FloatLabel } from "primeng/floatlabel";
import { InputNumber } from "primeng/inputnumber";
import { Button } from "primeng/button";
import { Select } from "primeng/select";
import { DatePicker } from "primeng/datepicker";
import { TooltipModule } from 'primeng/tooltip';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleService } from '../../../../core/services/vehicle-service';
import { VehicleResponse } from '../../../../core/models/vehicle-response.model';
import { NotificationService } from '../../../../core/services/notification';
import { RentalService } from '../../../../core/services/rental-service';
import { AuthService } from '../../../../core/services/auth';

@Component({
  selector: 'app-rental-form',
  imports: [Card, FloatLabel, InputNumber, Button, Select, DatePicker, ReactiveFormsModule, TooltipModule],
  templateUrl: './rental-form.html',
  styleUrl: './rental-form.scss',
})
export class RentalForm {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private vehicleService = inject(VehicleService);
  private notification = inject(NotificationService);
  private rentalService = inject(RentalService);
  private authService = inject(AuthService);

  periodOptions = [
    { label: 'Diário', value: 'Daily' },
    { label: 'Semanal', value: 'Weekly' },
    { label: 'Quinzenal', value: 'Biweekly' },
    { label: 'Mensal', value: 'Monthly' },
  ];

  vehicles = signal<VehicleResponse[]>([]);
  selectedTenant = signal<{ id: string; name: string } | null>(null);
  loading = signal(false);

  rental_form = this.fb.group({
    tenantId: ['', Validators.required],
    vehicleId: ['', Validators.required],
    startDate: [null, Validators.required],
    endDate: [null, Validators.required],
    period: ['', Validators.required],
    value: [<number | null>null, Validators.required],
    deposit: [<number | null>null, Validators.required]
  });

  ngOnInit() {
    const tenantId = this.route.snapshot.queryParamMap.get('tenantId');
    const tenantName = this.route.snapshot.queryParamMap.get('tenantName');

    if (tenantId && tenantName) {
      this.selectedTenant.set({ id: tenantId, name: tenantName });
      this.rental_form.patchValue({ tenantId });
    }

    this.carregarVeiculos();
  }

  private carregarVeiculos() {
    this.vehicleService.getAll().subscribe({
      next: (data) => this.vehicles.set(data),
      error: () => this.notification.error('Erro ao carregar veículos.')
    });
  }

  onSearchTenant() {
    this.router.navigate(['/app/landlord/persons/person-form'], {
      queryParams: { returnTo: '/app/landlord/rentals/rental-form' }
    });
  }

  get vehicleOptions() {
    return this.vehicles().map(v => ({
      ...v,
      label: `${v.brand} ${v.model} - ${v.plate}`
    }));
  }

  OnSubmit() {
    if (!this.rental_form.valid)
      return this.notification.error('Verifique os dados preenchidos.', 'Cadastro Incompleto');

    if (!this.selectedTenant())
      return this.notification.error('Selecione um locatário.', 'Locatário obrigatório');

    const f = this.rental_form.getRawValue();
    const ownerId = this.authService.currentUser()?.personId;

    if (!ownerId)
      return this.notification.error('Usuário não identificado.', 'Erro');

    const data = {
      tenantId: f.tenantId!,
      vehicleId: f.vehicleId!,
      startDate: this.formatDate(f.startDate!),
      endDate: this.formatDate(f.endDate!),
      period: f.period!,
      value: f.value!,
      deposit: f.deposit!
    };

    this.rentalService.create(data).subscribe({
      next: () => {
        this.notification.setPending('success', 'Sucesso', 'Locação criada com sucesso!');
        this.router.navigate(['/app/landlord/rentals']);
      },
      error: (err) => this.notification.error(err.error || 'Erro ao criar locação.')
    });
  }

  OnCancel() {
    this.notification.setPending('warn', 'Atenção', 'Operação cancelada.');
    this.router.navigate(['/app/landlord/rentals']);
  }

  private formatDate(date: Date | string | null): string | null {
    if (!date) return null;
    return new Date(date).toISOString().split('T')[0];
  }
}
