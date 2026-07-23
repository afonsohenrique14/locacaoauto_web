import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Vehicle, VEICULO_STATUS, VeiculoStatus } from '../models/vehicle.model';
import { VehicleLookup } from '../models/vehicle-lookup.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { VehicleAdd } from '../models/vehicle_add.model';
import { AuthService } from './auth';
import { VehicleResponse } from '../models/vehicle-response.model';

@Injectable({ providedIn: 'root' })
export class VehicleService {

  private http = inject(HttpClient);

  private authService = inject(AuthService);

  private readonly apiUrl = environment.apiUrl;




  FindDataVehicle(plate: string){
    return this.http.get<VehicleLookup>(`${this.apiUrl}/vehicles/${plate}`)
  }


  getAll(): Observable<VehicleResponse[]> {
    const personId = this.authService.currentUser()?.personId;
    if (!personId) return of([]);
    return this.http.get<VehicleResponse[]>(`${this.apiUrl}/landlords/${personId}/vehicles`);
  }

  addVehicle(data: VehicleAdd) {
    const personId = this.authService.currentUser()?.personId;
    return this.http.post<string>(`${this.apiUrl}/landlords/${personId}/vehicles`, data);
  }

  deleteVehichle(vehicleId: string){
    const personId = this.authService.currentUser()?.personId;
    return this.http.delete<string>(`${this.apiUrl}/landlords/${personId}/vehicles/${vehicleId}`);
  }

  getById(id: string): Observable<VehicleResponse> {
    return this.http.get<VehicleResponse>(`${this.apiUrl}/vehicles/${id}`);
  }

  getSeverity(status: VeiculoStatus): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    const map: Record<VeiculoStatus, 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast'> = {
      Available: 'success',
      Rented: 'info',
      InMaintenance: 'warn',
    };
    return map[status];
  }

  updateVehicle(id: string, data: { mileage?: number; status?: VeiculoStatus }) {
    const personId = this.authService.currentUser()?.personId;
    return this.http.patch<void>(`${this.apiUrl}/landlords/${personId}/vehicles/${id}`, data);
  }
}
