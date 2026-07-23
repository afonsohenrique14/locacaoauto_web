import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from "primeng/card";
import { Checkbox } from 'primeng/checkbox';
import { DatePicker } from 'primeng/datepicker';
import { FloatLabel } from "primeng/floatlabel";
import { InputNumber } from 'primeng/inputnumber';
import { VehicleService } from '../../../../core/services/vehicle-service';
import { InputText } from 'primeng/inputtext';
import { NotificationService } from '../../../../core/services/notification';
import { Button } from 'primeng/button';
import { Router } from '@angular/router';
import { VehicleAdd } from '../../../../core/models/vehicle_add.model';
import { TooltipModule } from 'primeng/tooltip';


@Component({
  selector: 'app-vehicle-form',
  imports: [CardModule, ReactiveFormsModule, FloatLabel, InputNumber, InputText, Button, TooltipModule],
  templateUrl: './vehicle-form.html',
  styleUrl: './vehicle-form.scss',
})
export class VehicleForm {
  private fb = inject(FormBuilder);
  private vehicleService = inject(VehicleService);
  private notification = inject(NotificationService);
  private router = inject(Router);
  loadingPlate = signal(false);

add_vehicle_form = this.fb.group({
  license: ['', [Validators.required]],
  brand: [{ value: '', disabled: true }, [Validators.required]],
  model: [{ value: '', disabled: true }, [Validators.required]],
  modelYear: [{ value: <number | null>null, disabled: true }, [Validators.required]],
  manufactureYear: [{ value: <number | null>null, disabled: true }, [Validators.required]],
  renavam: [<number | null>null, [Validators.required]],
  mileage: [<number | null>null, [Validators.required]]
});


  OnfillPlate() {
    const plate = this.add_vehicle_form.value.license?.valueOf();
    if (!plate) return;

    this.loadingPlate.set(true);

    this.vehicleService.FindDataVehicle(plate).subscribe({
      next: (vehicle) => {
        this.add_vehicle_form.patchValue({
          brand: vehicle.brand,
          model: vehicle.model,
          modelYear: vehicle.modelYear,
          manufactureYear: vehicle.manufactureYear,
          license: vehicle.plate,
        });

        this.add_vehicle_form.get('brand')?.disable();
        this.add_vehicle_form.get('model')?.disable();
        this.add_vehicle_form.get('modelYear')?.disable();
        this.add_vehicle_form.get('manufactureYear')?.disable();
        this.add_vehicle_form.get('license')?.disable();
      },
      error: () => {
        this.notification.error('Placa não encontrada ou serviço indisponível.');
      },
      complete: () => {
        this.loadingPlate.set(false);
      }
    });
  }

  OnSubmit(){
    console.log('form valid:', this.add_vehicle_form.valid);
    console.log('form value:', this.add_vehicle_form.value);
    console.log('form errors:', this.add_vehicle_form.errors);
    if (!this.add_vehicle_form.valid) return this.notification.error('Verifique se todos os dados foram preenchidos!', 'Cadastro Incompleto');

    const f = this.add_vehicle_form.getRawValue();

    const vehicle: VehicleAdd = {
      brand: f.brand!,
      model: f.model!,
      modelYear: f.modelYear!,
      manufactureYear: f.manufactureYear!,
      plate: f.license!,
      renavam: f.renavam!,
      mileage: f.mileage!
    }

    this.vehicleService.addVehicle(vehicle).subscribe({
      next: () => {
        this.notification.setPending('success', 'Sucesso', 'Veículo incluído com sucesso!')
        this.router.navigate(['/app/landlord/vehicles'])
      },
      error: (err) => this.notification.error(err.error || 'Erro ao incluir veículo.')

    })

  }

  OnCancel(){
    this.notification.setPending('warn', 'Atenção',  'Operação Cancelada!.')
    this.router.navigate(['/app/landlord/vehicles'])
  }
}
