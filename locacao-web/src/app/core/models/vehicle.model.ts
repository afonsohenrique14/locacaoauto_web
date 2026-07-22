import { LicensePlate } from "./licencePlante.model";


export const VEICULO_STATUS = {
  Available : 'Available',
  InMaintenance : 'InMaintenance',
  Rented : 'Rented'
} as const

export type VeiculoStatus = typeof VEICULO_STATUS[keyof typeof VEICULO_STATUS];

export interface Vehicle{
  id: string,
  brand: string,
  model: string,
  modelYear: number,
  manufactureYear: number,
  license: LicensePlate,
  renavam: string,
  mileage: number,
  vehicleStatus: VeiculoStatus
}
