import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Vehicle, VEICULO_STATUS } from '../models/vehicle.model';
import { VehicleLookup } from '../models/vehicle-lookup.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { VehicleAdd } from '../models/vehicle_add.model';

@Injectable({ providedIn: 'root' })
export class VehicleService {

  private http = inject(HttpClient)

  private readonly apiUrl = environment.apiUrl;

  private vehicles: Vehicle[] = [
    {
      id: '1',
      brand: 'Toyota',
      model: 'Corolla',
      modelYear: 2023,
      manufactureYear: 2022,
      license: { value: 'ABC1D23', isMercosul: true },
      renavam: '12345678901',
      mileage: 15000,
      vehicleStatus: VEICULO_STATUS.Available
    }
    // mais um ou dois pra ter dados na tela
  ];

  FindDataVehicle(plate: string){
    return this.http.get<VehicleLookup>(`${this.apiUrl}/vehicles/${plate}`)
  }

  getAll(): Observable<Vehicle[]> {
    return of(this.vehicles);
  }

  addVehicle(data:VehicleAdd){

    return this.http.post<string>(`${this.apiUrl}/vehicles`, data);
  }
}
