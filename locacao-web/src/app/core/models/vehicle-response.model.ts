import { VeiculoStatus } from "./vehicle.model";

// core/models/vehicle-response.model.ts
export interface VehicleResponse {
  id: string,
  brand: string,
  model: string,
  modelYear: number,
  manufactureYear: number,
  plate: string,
  renavam: string,
  ownerId: string,
  mileage: number,
  status: VeiculoStatus
}
